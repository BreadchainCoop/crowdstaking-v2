import { DISTRIBUTOR_ABI } from "@/abi";
import { getChain } from "@/chainConfig";
import { useReadContract, useAccount } from "wagmi";

export function usePreviousCycleStartingBlock() {
  const { chain: activeChain } = useAccount();
  const chainConfig = activeChain
    ? getChain(activeChain.id)
    : getChain("DEFAULT");

  return useReadContract({
    address: chainConfig.DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "previousCycleStartingBlock",
    query: {
      enabled: true,
    },
  });
}
