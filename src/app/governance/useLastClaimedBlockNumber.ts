import { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";

import { DISTRIBUTOR_ABI } from "@/abi";
import { getChain } from "@/chainConfig";

export function useLastClaimedBlockNumber() {
  const [lastClaimedBlocknumber, setLastClaimedBlockNumber] = useState<
    bigint | null
  >(null);

  const { chain: activeChain } = useAccount();
  const config = activeChain ? getChain(activeChain.id) : getChain("DEFAULT");
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
