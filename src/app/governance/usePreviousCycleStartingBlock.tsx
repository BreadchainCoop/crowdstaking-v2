import { DISTRIBUTOR_ABI } from "@/abi";
import { getConfig } from "@/chainConfig";
import { useReadContract, useAccount } from "wagmi";

export function usePreviousCycleStartingBlock() {
  const { chain: activeChain } = useAccount();
  const config = activeChain ? getConfig(activeChain.id) : getConfig("DEFAULT");

  return useReadContract({
    address: config.DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "previousCycleStartingBlock",
    query: {
      enabled: true,
    },
  });
}
