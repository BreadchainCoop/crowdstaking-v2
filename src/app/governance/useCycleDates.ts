import { useEffect, useState } from "react";
import { useBlockNumber } from "wagmi";
import { add, sub } from "date-fns";
import { CycleLengthState } from "./useCycleLength";
import { useLastClaimedBlockNumber } from "./useLastClaimedBlockNumber";

export type CycleDatesLoading = {
  status: "LOADING";
};
export type CycleDatesSuccess = {
  status: "SUCCESS";
  start: Date;
  end: Date;
};
export type CycleDatesError = {
  status: "ERROR";
};

export type CycleDatesState =
  | CycleDatesLoading
  | CycleDatesSuccess
  | CycleDatesError;

export function useCycleDates(cycleLength: CycleLengthState) {
  const [cycleDates, setCycleDates] = useState<CycleDatesState>({
    status: "LOADING",
  });

  const { lastClaimedBlocknumber } = useLastClaimedBlockNumber();

  const { data: currentBlockNumberData, status: currentBlockNumberStatus } =
    useBlockNumber();

  useEffect(() => {
    if (
      currentBlockNumberStatus === "error" ||
      lastClaimedBlocknumber ||
      cycleLength !== null
    ) {
    }
    if (
      lastClaimedBlocknumber &&
      cycleLength.status === "SUCCESS" &&
      currentBlockNumberStatus === "success" &&
      currentBlockNumberData
    ) {
      const secondsSinceStart =
        (Number(currentBlockNumberData) - Number(lastClaimedBlocknumber)) * 5;
      const cycleBlocksRemaining =
        Number(lastClaimedBlocknumber) +
        cycleLength.data -
        Number(currentBlockNumberData);
      const cycleSecondsRemaining = cycleBlocksRemaining * 5;
      setCycleDates({
        status: "SUCCESS",
        start: sub(new Date(), { seconds: secondsSinceStart }),
        end: add(new Date(), {
          seconds: cycleSecondsRemaining,
        }),
      });
    }
  }, [
    lastClaimedBlocknumber,
    cycleLength,
    currentBlockNumberData,
    currentBlockNumberStatus,
  ]);

  return { cycleDates };
}
