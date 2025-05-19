import { DISTRIBUTOR_ABI } from "@/abi";
import { useReadContract } from "wagmi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";

export function usePreviousCycleStartingBlock() {
  const chainConfig = useActiveChain();

  return useReadContract({
    address: chainConfig.DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "previousCycleStartingBlock",
    query: {
      enabled: true,
    },
  });
}
