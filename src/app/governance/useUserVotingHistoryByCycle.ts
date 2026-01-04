import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { getPublicClient } from "@wagmi/core";
import { getConfig } from "@/app/core/hooks/WagmiProvider/config/getConfig";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { Address, Hex } from "viem";
import { DISTRIBUTOR_ABI } from "@/abi";
import { SUBGRAPH_QUERY_URL } from "@/constants";

interface YieldDistribution {
  id: string;
  timestamp: string;
}

interface YieldDistributionsResponse {
  yieldDistributeds: YieldDistribution[];
}

type VoteLogData = {
  blockNumber: bigint;
  args: {
    account: Hex;
    points: Array<bigint>;
    projects: Array<Hex>;
  };
};

export interface VoteByCycle {
  cycleNumber: number;
  cycleEndTimestamp: number;
  vote: {
    blockNumber: bigint;
    timestamp: number;
    transactionHash: string;
    votes: Array<{
      projectAddress: Hex;
      points: number;
      percentage: number;
    }>;
  };
}

export function useUserVotingHistoryByCycle(userAddress: Address | undefined) {
  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;
  const publicClient = getPublicClient(getConfig().config);

  return useQuery<VoteByCycle[]>({
    queryKey: ["userVotingHistoryByCycle", userAddress],
    enabled: !!userAddress,
    async queryFn() {
      if (!userAddress) return [];

      console.log("Fetching voting history by cycle for address:", userAddress);

      // Fetch all yield distributions to get cycle boundaries
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
            timestamp
          }
        }
      `);

      const distributions = distributionsResponse.yieldDistributeds;
      console.log("Found cycles:", distributions.length);

      // Get all BreadHolderVoted events for this user
      const logs = await publicClient.getContractEvents({
        address: distributorAddress,
        abi: DISTRIBUTOR_ABI,
        eventName: "BreadHolderVoted",
        args: {
          account: userAddress,
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      });

      console.log("Found vote events:", logs.length);

      // Get block details for all votes
      const votesWithTimestamps = await Promise.all(
        (logs as unknown as Array<VoteLogData>).map(async (log) => {
          const block = await publicClient.getBlock({
            blockNumber: log.blockNumber,
          });

          const totalPoints = log.args.points.reduce(
            (acc, p) => acc + p,
            BigInt(0)
          );

          const votes = log.args.projects.map((project, index) => {
            const points = Number(log.args.points[index]);
            const percentage =
              totalPoints > 0
                ? (Number(log.args.points[index]) / Number(totalPoints)) * 100
                : 0;

            return {
              projectAddress: project as Hex,
              points,
              percentage,
            };
          });

          return {
            blockNumber: log.blockNumber,
            timestamp: Number(block.timestamp),
            transactionHash: block.hash,
            votes: votes.filter((v) => v.points > 0),
          };
        })
      );

      // Group votes by cycle and keep only the last vote per cycle
      const votesByCycle = new Map<number, typeof votesWithTimestamps[0]>();

      // Create cycle boundaries: [previousCycleEnd, currentCycleEnd]
      const cycleBoundaries = distributions.map((dist, index) => ({
        cycleNumber: distributions.length - index,
        cycleEndTimestamp: Number(dist.timestamp),
        previousCycleEndTimestamp:
          index < distributions.length - 1
            ? Number(distributions[index + 1].timestamp)
            : 0, // First cycle starts from block 0
      }));

      // Match each vote to its cycle
      for (const vote of votesWithTimestamps) {
        const cycle = cycleBoundaries.find(
          (c) => vote.timestamp <= c.cycleEndTimestamp &&
                 vote.timestamp > c.previousCycleEndTimestamp
        );

        if (cycle) {
          const existingVote = votesByCycle.get(cycle.cycleNumber);
          // Keep the most recent vote (highest timestamp) for this cycle
          if (!existingVote || vote.timestamp > existingVote.timestamp) {
            votesByCycle.set(cycle.cycleNumber, vote);
          }
        }
      }

      // Convert to array and sort by cycle number descending (most recent first)
      const result: VoteByCycle[] = Array.from(votesByCycle.entries())
        .map(([cycleNumber, vote]) => {
          const cycle = cycleBoundaries.find(c => c.cycleNumber === cycleNumber)!;
          return {
            cycleNumber,
            cycleEndTimestamp: cycle.cycleEndTimestamp,
            vote,
          };
        })
        .sort((a, b) => b.cycleNumber - a.cycleNumber);

      console.log("Votes by cycle:", result.length);
      return result;
    },
  });
}
