import { getChain } from "@/chainConfig";
import { useAccount, useReadContract } from "wagmi";
import { SDAI_ADAPTOR_ABI } from "@/abi";

export function useVaultAPY() {
  const { chain: activeChain } = useAccount();
  const chainConfig = activeChain
    ? getChain(activeChain.id)
    : getChain("DEFAULT");

  const { data: vaultAPYData, status: vaultAPYStatus } = useReadContract({
    address: chainConfig.SDAI_ADAPTOR.address,
    abi: SDAI_ADAPTOR_ABI,
    functionName: "vaultAPY",
  });

  return { vaultAPYData, vaultAPYStatus };
}
