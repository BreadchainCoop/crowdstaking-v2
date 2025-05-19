import { useReadContract } from "wagmi";
import { SDAI_ADAPTOR_ABI } from "@/abi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";

export function useVaultAPY() {
  const chainConfig = useActiveChain();

  return useReadContract({
    address: chainConfig.SDAI_ADAPTOR.address,
    abi: SDAI_ADAPTOR_ABI,
    functionName: "vaultAPY",
  });
}
