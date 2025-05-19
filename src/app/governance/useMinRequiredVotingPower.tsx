import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { DISTRIBUTOR_ABI } from "@/abi";
import { formatUnits } from "viem";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";

export function useMinRequiredVotingPower() {
  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;
  const [minRequiredVotingPower, setMinRequiredVotingPower] = useState<
    number | null
  >(null);

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
