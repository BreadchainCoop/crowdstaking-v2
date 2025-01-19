import { DISTRIBUTOR_ABI } from "@/abi";
import { getConfig } from "@/chainConfig";
import { useEffect, useState } from "react";
import { Hex } from "viem";
import { useReadContract, useNetwork } from "wagmi";

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
  const [currentVotingDistribution, setCurrentVotingDistribution] =
    useState<CurrentVotingDistributionState>({
      status: "LOADING",
    });

  const { chain: activeChain } = useNetwork();
  const config = activeChain ? getConfig(activeChain.id) : getConfig("DEFAULT");
  const distriubutorAddress = config.DISBURSER.address;

  const {
    data: currentVotingDistributionData,
    status: currentVotingDistributionStatus,
    error: currentVotingDistributionError,
  } = useReadContract({
    address: distriubutorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "getCurrentVotingDistribution",
    query: {
      enabled: distriubutorAddress !== "0x",
    },
  });

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
