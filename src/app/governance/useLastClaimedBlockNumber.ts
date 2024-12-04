import { useEffect, useState } from "react";
import { useContractRead, useNetwork } from "wagmi";

import { DISTRIBUTOR_ABI } from "@/abi";
import { getConfig } from "@/chainConfig";
import { formatUnits } from "viem";

export function useLastClaimedBlockNumber() {
  const [lastClaimedBlocknumber, setLastClaimedBlockNumber] = useState<
    bigint | null
  >(null);

  const { chain: activeChain } = useNetwork();
  const config = activeChain ? getConfig(activeChain.id) : getConfig("DEFAULT");
  const distributorAddress = config.DISBURSER.address;

  const {
    data: lastClaimedBlockNumberData,
    status: lastClaimedBlockNumberStatus,
  } = useContractRead({
    address: distributorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "lastClaimedBlockNumber",
    enabled: distributorAddress !== "0x",
  });

  useEffect(() => {
    if (
      lastClaimedBlockNumberStatus === "success" &&
      lastClaimedBlockNumberData
    ) {
      setLastClaimedBlockNumber(lastClaimedBlockNumberData);
    }
  }, [lastClaimedBlockNumberStatus, lastClaimedBlockNumberData]);

  return { lastClaimedBlocknumber };
}
