import { useQuery } from "@tanstack/react-query";
import { useUserVotingHistoryByCycle } from "@/app/governance/useUserVotingHistoryByCycle";
import { GraphQLClient } from "graphql-request";
import { formatUnits, Hex } from "viem";
import { SUBGRAPH_QUERY_URL } from "@/constants";

interface YieldDistribution {
  id: string;
  yield: string;
  totalVotes: string;
  timestamp: string;
}

interface YieldDistributionsResponse {
  yieldDistributeds: YieldDistribution[];
}

/**
 * Calculate the total yield influenced by the user across all their votes
 *
 * This sums up the yield amounts shown next to each project in the voting history
 * across all cycles. The calculation matches what's displayed in UserVotingHistory.
 */
export function useUserTotalYieldInfluenced(userAddress: Hex | undefined) {
  const { data: votingHistory, isLoading: votingHistoryLoading } = useUserVotingHistoryByCycle(userAddress);

  return useQuery({
    queryKey: ["userTotalYieldInfluenced", userAddress],
    enabled: !!userAddress && !!votingHistory && votingHistory.length > 0,
    queryFn: async () => {
      if (!votingHistory || votingHistory.length === 0) {
        return { total: 0, byProject: {} };
      }

      // Fetch all yield distributions
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

      let totalYieldInfluenced = 0;
      const yieldByProject: Record<string, { amount: number; projectAddress: string }> = {};

      // Iterate through each cycle the user voted in
      for (const cycleVote of votingHistory) {
        // Get the distribution for this cycle (cycleNumber = index in distributions array)
        // distributions[0] is the most recent, so we need to map cycleNumber to index
        const cycleIndex = distributions.length - cycleVote.cycleNumber;
        const distribution = distributions[cycleIndex];

        if (!distribution) continue;

        // Calculate total yield and democratic pool for this cycle
        const totalYield = Number(formatUnits(BigInt(distribution.yield), 18));
        const democraticPool = totalYield / 2; // 50% goes to democratic distribution

        // Calculate total votes in this cycle
        const totalVotes = cycleVote.vote.votes.reduce((sum, v) => sum + v.points, 0);

        if (totalVotes === 0) continue;

        // Calculate yield influenced for each project the user voted for
        for (const vote of cycleVote.vote.votes) {
          if (vote.points === 0) continue;

          // Calculate yield influenced: (user's vote points / total votes) × democratic pool
          const yieldInfluenced = (vote.points / totalVotes) * democraticPool;

          totalYieldInfluenced += yieldInfluenced;

          // Accumulate by project
          const projectAddress = vote.projectAddress.toLowerCase();
          if (!yieldByProject[projectAddress]) {
            yieldByProject[projectAddress] = {
              amount: 0,
              projectAddress: vote.projectAddress,
            };
          }
          yieldByProject[projectAddress].amount += yieldInfluenced;
        }
      }

      return {
        total: totalYieldInfluenced,
        byProject: yieldByProject,
      };
    },
  });
}
