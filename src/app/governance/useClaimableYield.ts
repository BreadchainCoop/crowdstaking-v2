import { BREAD_ABI } from "@/abi";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { useActiveChain } from "../core/hooks/useActiveChain";

// Value as at when I ran the query
export const FALLBACK_CLAIMABLE_YIELD = 113.35748823553301;

export function useClaimableYield() {
  const [claimableYield, setClaimableYield] = useState<number | null>(null);

  const chainConfig = useActiveChain();
  const breadAddress = chainConfig.BREAD.address;

  const { data, status, error } = useReadContract({
    address: breadAddress,
    abi: BREAD_ABI,
    functionName: "yieldAccrued",
    query: {
      enabled: breadAddress !== "0x",
    },
    chainId: chainConfig.ID
  });

  useEffect(() => {
    if (status === "success" && data !== null) {
      setClaimableYield(parseFloat(formatUnits(data as bigint, 18)));
    }
    if (status === "error") {
      console.error(error);
    }
  }, [data, status, error, setClaimableYield]);

  return { claimableYield };
}
