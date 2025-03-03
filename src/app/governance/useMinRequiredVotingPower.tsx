import { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";

import { DISTRIBUTOR_ABI } from "@/abi";
import { getChain } from "@/chainConfig";
import { formatUnits } from "viem";

export function useMinRequiredVotingPower() {
  const [minRequiredVotingPower, setMinRequiredVotingPower] = useState<
    number | null
  >(null);

  const { chain: activeChain } = useAccount();
  const chainConfig = activeChain
    ? getChain(activeChain.id)
    : getChain("DEFAULT");
  const distributorAddress = chainConfig.DISBURSER.address;

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
