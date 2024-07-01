import { BREAD_GNOSIS_ABI } from "@/abi";
import { getConfig } from "@/chainConfig";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useContractRead, useNetwork } from "wagmi";

export function useClaimableYield() {
  const [claimableYield, setClaimableYield] = useState<number | null>(null);

  const { chain: activeChain } = useNetwork();

  const config = activeChain ? getConfig(activeChain.id) : getConfig("DEFAULT");
  const breadAddress = config.BREAD.address;

  const { data, status, error } = useContractRead({
    address: breadAddress,
    abi: BREAD_GNOSIS_ABI,
    functionName: "yieldAccrued",
    watch: true,
    enabled: breadAddress !== "0x",
  });

  useEffect(() => {
    if (status === "success" && data !== null) {
      setClaimableYield(parseFloat(formatUnits(data as bigint, 18)));
    }
    if (status === "error") {
      console.log(error);
    }
  }, [data, status, error, setClaimableYield]);

  return { claimableYield };
}
