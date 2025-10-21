import { useReadContract } from "wagmi";
import { SDAI_ADAPTOR_ABI } from "@/abi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";

// Value as at when I ran the query
export const FALLBACK_APY_VALUE = "5.9%"; //. to 1 decimal place

export function useVaultAPY() {
  const chainConfig = useActiveChain();

  return useReadContract({
    address: chainConfig.SDAI_ADAPTOR.address,
    abi: SDAI_ADAPTOR_ABI,
    functionName: "vaultAPY",
    chainId: chainConfig.ID
  });
}
