import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";

import { DISTRIBUTOR_ABI } from "@/abi";
import { useActiveChain } from "../core/hooks/useActiveChain";

export function useLastClaimedBlockNumber() {
  const [lastClaimedBlocknumber, setLastClaimedBlockNumber] = useState<
    bigint | null
  >(null);

  const config = useActiveChain()
  const distributorAddress = config.DISBURSER.address;

  const {
    data: lastClaimedBlockNumberData,
    status: lastClaimedBlockNumberStatus,
  } = useReadContract({
    address: distributorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "lastClaimedBlockNumber",
    query: {
      enabled: distributorAddress !== "0x",
    },
    chainId: config.ID
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
