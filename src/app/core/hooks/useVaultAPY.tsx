import { useReadContract } from "wagmi";
import { SDAI_ADAPTOR_ABI } from "@/abi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { parseEther } from "viem";

// Placeholder shown (and counted up toward) while the real APY loads
export const FALLBACK_APY_VALUE = parseEther("0.04");

export function useVaultAPY() {
	const chainConfig = useActiveChain();
	return useReadContract({
		address: chainConfig.SDAI_ADAPTOR.address,
		abi: SDAI_ADAPTOR_ABI,
		functionName: "vaultAPY",
		chainId: chainConfig.ID,
	});
}
