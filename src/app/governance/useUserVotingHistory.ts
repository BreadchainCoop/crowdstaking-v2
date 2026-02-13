import { getPublicClient } from "@wagmi/core";
import { getConfig } from "@/app/core/hooks/WagmiProvider/config/getConfig";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { useQuery } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { DISTRIBUTOR_ABI } from "@/abi";

type VoteLogData = {
  blockNumber: bigint;
  args: {
    account: Hex;
    points: Array<bigint>;
    projects: Array<Hex>;
  };
};

export interface UserVote {
  blockNumber: bigint;
  timestamp: number;
  transactionHash: string;
  votes: Array<{
    projectAddress: Hex;
    points: number;
    percentage: number;
  }>;
}

export function useUserVotingHistory(userAddress: Address | undefined) {
  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;
  const publicClient = getPublicClient(getConfig().config);

  return useQuery<UserVote[]>({
    queryKey: ["userVotingHistory", userAddress],
    enabled: !!userAddress,
    async queryFn() {
      if (!userAddress) return [];

      console.log("Fetching voting history for address:", userAddress);

      // Get all BreadHolderVoted events for this user from the beginning
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

      // Get block details to retrieve timestamps
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

      // Sort by block number descending (most recent first)
      return votesWithTimestamps.sort((a, b) =>
        a.blockNumber > b.blockNumber ? -1 : 1
      );
    },
  });
}
