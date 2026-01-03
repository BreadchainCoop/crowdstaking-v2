import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { Address, formatUnits, Hex } from "viem";
import { SUBGRAPH_QUERY_URL } from "@/constants";
import { useUserVotingHistoryByCycle } from "./useUserVotingHistoryByCycle";

interface YieldDistribution {
  id: string;
  yield: string;
  totalVotes: string;
  timestamp: string;
  projectDistributions: string[];
  projectAddresses: Address[];
}

interface YieldDistributionsResponse {
  yieldDistributeds: YieldDistribution[];
}

export interface ProjectYieldContribution {
  projectAddress: Hex;
  totalYieldContributed: number;
  cycleContributions: Array<{
    cycleNumber: number;
    yieldContributed: number;
    userVotePercentage: number;
    totalYieldInCycle: number;
  }>;
}

/**
 * Calculate how much yield a user has helped distribute to each project
 * across all voting cycles
 *
 * This calculation uses the project distributions from the subgraph to determine
 * how much voting power each project received, then calculates the user's
 * proportional contribution based on their vote allocation percentages.
 */
export function useUserYieldContributions(userAddress: Address | undefined) {
  const { data: votingHistory, isLoading: votingHistoryLoading } =
    useUserVotingHistoryByCycle(userAddress);

  const queryEnabled = !!userAddress && !votingHistoryLoading && !!votingHistory && votingHistory.length > 0;

  return useQuery<ProjectYieldContribution[]>({
    queryKey: ["userYieldContributions", userAddress],
    enabled: queryEnabled,
    async queryFn() {
      if (!userAddress || !votingHistory || votingHistory.length === 0) {
        return [];
      }

      // Fetch all yield distributions with project distribution data
      const API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;
      const client = new GraphQLClient(SUBGRAPH_QUERY_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      const distributionsResponse = await client.request<YieldDistributionsResponse>(`
        query {
          yieldDistributeds(orderBy: timestamp, orderDirection: desc) {
            id
            yield
            totalVotes
            timestamp
            projectDistributions
            projectAddresses
          }
        }
      `);

      const distributions = distributionsResponse.yieldDistributeds;

      // Create a map of cycle number -> distribution data
      const cycleDistributionMap = new Map<number, YieldDistribution>();
      distributions.forEach((dist, index) => {
        const cycleNumber = distributions.length - index;
        cycleDistributionMap.set(cycleNumber, dist);
      });

      // Calculate contributions per project
      const projectContributionsMap = new Map<Hex, ProjectYieldContribution>();

      for (const voteCycle of votingHistory) {
        const distribution = cycleDistributionMap.get(voteCycle.cycleNumber);

        if (!distribution) {
          continue;
        }

        const totalYield = Number(formatUnits(BigInt(distribution.yield), 18));
        const totalVotes = Number(formatUnits(BigInt(distribution.totalVotes), 18));
        const democraticPool = totalYield / 2; // 50% goes to democratic distribution

        // Create a map of project -> its votes for this cycle
        const projectVotesMap = new Map<string, number>();
        distribution.projectAddresses.forEach((addr, index) => {
          const projectVotes = Number(formatUnits(BigInt(distribution.projectDistributions[index]), 18));
          projectVotesMap.set(addr.toLowerCase(), projectVotes);
        });

        // For each project the user voted for in this cycle
        for (const vote of voteCycle.vote.votes) {
          if (vote.points === 0) continue;

          const projectVotes = projectVotesMap.get(vote.projectAddress.toLowerCase());
          if (!projectVotes || totalVotes === 0) continue;

          // Calculate how much this project received from the democratic pool
          const projectDemocraticYield = (projectVotes / totalVotes) * democraticPool;

          // User's contribution is proportional to their vote percentage
          // If user allocated 25% of their votes to this project, they're responsible
          // for roughly 25% of the project's democratic yield they could have influenced
          const yieldContributed = projectDemocraticYield * (vote.percentage / 100);

          // Get or create project contribution record
          let projectContribution = projectContributionsMap.get(vote.projectAddress);
          if (!projectContribution) {
            projectContribution = {
              projectAddress: vote.projectAddress,
              totalYieldContributed: 0,
              cycleContributions: [],
            };
            projectContributionsMap.set(vote.projectAddress, projectContribution);
          }

          // Add this cycle's contribution
          projectContribution.totalYieldContributed += yieldContributed;
          projectContribution.cycleContributions.push({
            cycleNumber: voteCycle.cycleNumber,
            yieldContributed,
            userVotePercentage: vote.percentage,
            totalYieldInCycle: totalYield,
          });
        }
      }

      // Convert map to array and sort by total contribution descending
      const result = Array.from(projectContributionsMap.values()).sort(
        (a, b) => b.totalYieldContributed - a.totalYieldContributed
      );

      return result;
    },
  });
}
