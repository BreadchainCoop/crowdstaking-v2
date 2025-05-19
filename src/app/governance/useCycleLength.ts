import { DISTRIBUTOR_ABI } from "@/abi";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";

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
  const chainConfig = useActiveChain();
  const distributorAddress = chainConfig.DISBURSER.address;

  const [cycleLength, setCycleLength] = useState<CycleLengthState>({
    status: "LOADING",
  });

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
