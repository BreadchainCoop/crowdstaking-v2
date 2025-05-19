import { useEffect, useState } from "react";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { Hex } from "viem";
import { DISTRIBUTOR_ABI } from "@/abi";

export type CurrentVotingDistributionState =
  | CurrentVotingDistributionLoading
  | CurrentVotingDistributionSuccess
  | CurrentVotingDistributionError;

export type CurrentVotingDistributionLoading = {
  status: "LOADING";
};
export type CurrentVotingDistributionSuccess = {
  status: "SUCCESS";
  data: [Hex[], number[]];
};
export type CurrentVotingDistributionError = {
  status: "ERROR";
};

export function useCurrentVotingDistribution() {
  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;
  const [currentVotingDistribution, setCurrentVotingDistribution] =
    useState<CurrentVotingDistributionState>({
      status: "LOADING",
    });

  const {
    data: currentVotingDistributionData,
    status: currentVotingDistributionStatus,
    error: currentVotingDistributionError,
  } = useRefetchOnBlockChange(
    distributorAddress,
    DISTRIBUTOR_ABI,
    "getCurrentVotingDistribution",
    [],
    {
      enabled: distributorAddress !== "0x",
    }
  );

  useEffect(() => {
    if (
      currentVotingDistributionStatus === "success" &&
      currentVotingDistributionData
    ) {
      const [accounts, points] = currentVotingDistributionData as [
        Hex[],
        bigint[]
      ];

      const parsedPoints = points.map((bigPoints) => Number(bigPoints));

      setCurrentVotingDistribution({
        status: "SUCCESS",
        data: [accounts, parsedPoints],
      });
      return;
    }
    if (
      currentVotingDistributionStatus === "error" &&
      currentVotingDistributionError
    ) {
      console.error({ error: currentVotingDistributionError });
      setCurrentVotingDistribution({
        status: "ERROR",
      });
    }
  }, [
    currentVotingDistributionStatus,
    currentVotingDistributionData,
    currentVotingDistributionError,
  ]);

  return { currentVotingDistribution };
}
