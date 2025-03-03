import { DISTRIBUTOR_ABI } from "@/abi";
import { getChain } from "@/chainConfig";
import { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";

export type CycleLengthState =
  | CycleLengthLoading
  | CycleLengthSuccess
  | CycleLengthError;

export type CycleLengthLoading = {
  status: "LOADING";
};
export type CycleLengthSuccess = {
  status: "SUCCESS";
  data: number;
};
export type CycleLengthError = {
  status: "ERROR";
};

export function useCycleLength() {
  const [cycleLength, setCycleLength] = useState<CycleLengthState>({
    status: "LOADING",
  });

  const { chain: activeChain } = useAccount();
  const chainConfig = activeChain
    ? getChain(activeChain.id)
    : getChain("DEFAULT");
  const distributorAddress = chainConfig.DISBURSER.address;

  const {
    data: cycleLengthData,
    status: cycleLengthStatus,
    error: cycleLengthError,
  } = useReadContract({
    address: distributorAddress,
    abi: DISTRIBUTOR_ABI,
    functionName: "cycleLength",
  });

  useEffect(() => {
    if (cycleLengthStatus === "success" && cycleLengthData !== null) {
      setCycleLength({
        status: "SUCCESS",
        data: Number(cycleLengthData),
      });
    }
    if (cycleLengthStatus === "error" && cycleLengthError) {
      console.error(cycleLengthError);
      setCycleLength({
        status: "ERROR",
      });
    }
  }, [cycleLengthStatus, cycleLengthData, cycleLengthError]);

  return { cycleLength };
}
