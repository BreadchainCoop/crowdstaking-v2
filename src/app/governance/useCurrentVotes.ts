import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { useQuery } from "@tanstack/react-query";
import { createPublicClient, Hex, http } from "viem";
import { DISTRIBUTOR_ABI } from "@/abi";
import { foundryChain } from "../core/hooks/WagmiProvider/config/devConfig";
import { gnosis } from "viem/chains";

type VoteLogData = {
  blockTimestamp: Hex;
  args: {
    account: Hex;
    points: Array<bigint>;
    projects: Array<Hex>;
  };
};

export function useCurrentVotes(lastClaimedBlockNumber: bigint | null) {
  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;

  const publicClient = createPublicClient({
    chain: chainConfig.ID === 31337 ? foundryChain : gnosis,
    transport: http(
      chainConfig.ID === 31337 ? "http://localhost:8545" : undefined,
    ),
  });

  return useQuery({
    queryKey: ["getVotesForCurrentRound"],
    refetchInterval: 500,
    enabled: !!lastClaimedBlockNumber,
    queryFn: async () => {
      const logs = await publicClient.getContractEvents({
        address: distributorAddress,
        abi: DISTRIBUTOR_ABI,
        eventName: "BreadHolderVoted",
        fromBlock: lastClaimedBlockNumber || BigInt(0),
        toBlock: "latest",
      });
      const parsed = (logs as unknown as Array<VoteLogData>).map(parseVoteLog);
      return parsed;
    },
  });
}

export type ParsedVote = {
  account: Hex;
  blockTimestamp: number;
  points: number[];
  projects: Hex[];
};

function parseVoteLog(log: VoteLogData): ParsedVote {
  return {
    account: log.args.account,
    blockTimestamp: 1000,
    points: log.args.points.map((bigPoints) => Number(bigPoints)),
    projects: log.args.projects,
  };
}

function pointsToPermyraid(points: Array<number>) {
  const total = points.reduce((acc, num) => acc + num, 0);
  return points.map((p) => Math.floor((p * 10000) / total));
}
