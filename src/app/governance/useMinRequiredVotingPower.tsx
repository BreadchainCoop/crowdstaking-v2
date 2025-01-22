import { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";

import { DISTRIBUTOR_ABI } from "@/abi";
import { getConfig } from "@/chainConfig";
import { formatUnits } from "viem";

export function useMinRequiredVotingPower() {
  const [minRequiredVotingPower, setMinRequiredVotingPower] = useState<
    number | null
  >(null);

  const { chain: activeChain } = useAccount();
  const config = activeChain ? getConfig(activeChain.id) : getConfig("DEFAULT");
  const distributorAddress = config.DISBURSER.address;

  const {
    data: minRequiredVotingPowerData,
    status: minRequiredVotingPowerStatus,
  } = useReadContract({
    address: distributorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "minRequiredVotingPower",
  });

  useEffect(() => {
    if (
      minRequiredVotingPowerStatus === "success" &&
      minRequiredVotingPowerData
    ) {
      setMinRequiredVotingPower(
        Number(formatUnits(minRequiredVotingPowerData as bigint, 18))
      );
    }
  }, [minRequiredVotingPowerStatus, minRequiredVotingPowerData]);

  return { minRequiredVotingPower };
}
