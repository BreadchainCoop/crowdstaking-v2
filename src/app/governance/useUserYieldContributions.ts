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
 */
export function useUserYieldContributions(userAddress: Address | undefined) {
  const { data: votingHistory, isLoading: votingHistoryLoading } =
    useUserVotingHistoryByCycle(userAddress);

  return useQuery<ProjectYieldContribution[]>({
    queryKey: ["userYieldContributions", userAddress],
    enabled: !!userAddress && !votingHistoryLoading && !!votingHistory && votingHistory.length > 0,
    async queryFn() {
      if (!userAddress || !votingHistory || votingHistory.length === 0) return [];

      // Fetch all yield distributions to get cycle data
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

        if (!distribution) continue;

        const totalYield = Number(formatUnits(BigInt(distribution.yield), 18));
        const totalVotes = Number(formatUnits(BigInt(distribution.totalVotes), 18));
        const democraticPool = totalYield / 2; // 50% goes to democratic distribution

        // For each project the user voted for in this cycle
        for (const vote of voteCycle.vote.votes) {
          if (vote.points === 0) continue;

          // User's contribution to this project's democratic distribution
          // = (user's points for project / total votes) * democratic pool
          // Note: vote.points is a raw number from BigInt, we need to format it to match totalVotes units
          const userVotesForProject = vote.points / 1e18; // Convert from wei to ether units
          const yieldContributed = totalVotes > 0
            ? (userVotesForProject / totalVotes) * democraticPool
            : 0;

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
