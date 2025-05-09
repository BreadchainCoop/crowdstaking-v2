import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { formatBalance } from "@/app/core/util/formatter";
import { CycleDatesState } from "../useCycleDates";
import { useClaimableYield } from "../useClaimableYield";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import Tooltip from "@/app/core/components/Tooltip";
import { CardBox } from "@/app/core/components/CardBox";
import { useReadContract, useAccount } from "wagmi";

import { ERC20_ABI, SDAI_ADAPTOR_ABI } from "@/abi";
import { useEffect, useMemo, useState } from "react";
import { differenceInDays, differenceInHours, format } from "date-fns";
import { getChain } from "@/chainConfig";
import { formatUnits } from "viem";
import clsx from "clsx";

export function DistributionOverview({
  cycleDates,
  distributions,
}: {
  cycleDates: CycleDatesState;
  distributions: number | undefined;
}) {
  const { claimableYield } = useClaimableYield();
  const { chain: activeChain } = useAccount();
  const [dsrAPY, setDsrAPY] = useState("");
  const chainConfig = activeChain
    ? getChain(activeChain.id)
    : getChain("DEFAULT");
  const [yieldIncrement, setYieldIncrement] = useState(0);

  const {
    data: apyData,
    error: apyError,
    status: apyStatus,
  } = useReadContract({
    address: chainConfig.SDAI_ADAPTOR.address,
    abi: SDAI_ADAPTOR_ABI,
    functionName: "vaultAPY",
  });

  const { data: totalSupplyData, status: totalSupplyStatus } =
    useRefetchOnBlockChange(
      chainConfig.BREAD.address,
      ERC20_ABI,
      "totalSupply",
      []
    );

  const yieldPerHour = useMemo(() => {
    if (
      apyStatus === "success" &&
      apyData &&
      totalSupplyStatus === "success" &&
      totalSupplyData
    ) {
      const dsr = Number(formatUnits(apyData as bigint, 18));
      const totalSupply = Number(formatUnits(totalSupplyData as bigint, 18));
      const yieldPerDay = (totalSupply * dsr) / 365;
      const yieldPerHour = yieldPerDay / 24;

      setDsrAPY((dsr * 100).toFixed(2));

      return yieldPerHour;
    }
    return null;
  }, [apyStatus, apyData, totalSupplyStatus, totalSupplyData]);

  const estimateTotal = useMemo(() => {
    if (
      cycleDates.status === "SUCCESS" &&
      claimableYield !== null &&
      yieldPerHour
    ) {
      const difference = differenceInHours(cycleDates.end, new Date());
      return difference * yieldPerHour + claimableYield;
    }
  }, [yieldPerHour, claimableYield, cycleDates]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (claimableYield !== null && yieldPerHour) {
      intervalId = setInterval(() => {
        setYieldIncrement((val) => (val += (yieldPerHour / 60 / 60) * 1.5));
      }, 1500);
    }
    return () => clearInterval(intervalId);
  }, [claimableYield, yieldPerHour]);

  const completedDays = useMemo(() => {
    if (cycleDates.status !== "SUCCESS") return null;
    const daysRemaining = differenceInDays(cycleDates.end, new Date());
    const totalDaysCount = differenceInDays(cycleDates.end, cycleDates.start);
    const days: boolean[] = [];
    for (let i = 0; i < totalDaysCount; i++) {
      days.unshift(i >= daysRemaining);
    }
    return days;
  }, [cycleDates]);

  return (
    <div className="col-span-12 lg:col-span-4 row-start-2 lg:row-start-1 lg:row-span-2">
      <div className="flex justify-center lg:block lg:w-full">
        <CardBox>
          <div className="max-w-96 m-auto lg:max-w-full flex flex-col items-center justify-center p-5 shadow-card">
            <h4 className="text-xl font-medium text-breadgray-rye dark:text-breadgray-light-grey tracking-wide uppercase leading-none">
              Amount to Distribute
            </h4>
            <div className="pt-4 pb-6 w-full items-center">
              {claimableYield !== null ? (
                <div className="w-full flex justify-center tracking-wider text-3xl font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white leading-none">
                  <div className=" flex gap-2  justify-end">
                    <div className="mt-1">
                      <BreadIcon />
                    </div>
                    <span>
                      {
                        formatBalance(claimableYield + yieldIncrement, 4).split(
                          "."
                        )[0]
                      }
                    </span>
                  </div>
                  <div>.</div>
                  <div className="text-xl leading-[1.1] w-[56px] self-end">
                    {
                      formatBalance(claimableYield + yieldIncrement, 4).split(
                        "."
                      )[1]
                    }
                  </div>
                </div>
              ) : (
                <div className="text-3xl opacity-0">.</div>
              )}

              <p className="flex justify-center pt-1 font-medium text-xs text-breadgray-rye dark:text-breadgray-grey">
                <span className="me-1">Current accumulated yield</span>
                <Tooltip>
                  Based on the current DAI savings rate of {dsrAPY + "% "}
                  applied on the total baked $BREAD on Gnosis chain.
                </Tooltip>
              </p>
            </div>
            <div className="w-full flex flex-col gap-3 py-3 border-1 border-t border-b border-t-breadgray-light-grey border-b-breadgray-light-grey dark:border-t-breadgray-rye dark:border-b-breadgray-rye">
              <div className="flex w-full">
                <p className="grow text-breadgray-rye dark:text-breadgray-grey">
                  Estimated after 30 days
                </p>
                <div className="flex gap-2 items-center md:justify-center">
                  <BreadIcon size="small" />
                  <span className="font-bold text-breadgray-grey100 dark:text-breadgray-white">
                    {estimateTotal ? formatBalance(estimateTotal, 2) : "--.--"}
                  </span>
                </div>
              </div>
              <div className="flex w-full">
                <p className="grow text-breadgray-rye dark:text-breadgray-grey">
                  DAI savings rate (APY)
                </p>
                <div className="flex gap-2 items-center md:justify-center">
                  <span className="font-bold text-breadgray-grey100 dark:text-breadgray-white">
                    {dsrAPY + "%"}
                  </span>
                </div>
              </div>
              <div className="flex w-full gap-2">
                <p className="grow text-breadgray-rye dark:text-breadgray-grey">
                  Voting cycle #
                  {distributions == undefined ? "--" : distributions + 1}
                </p>
                {cycleDates.status === "LOADING" ? (
                  <span>--</span>
                ) : cycleDates.status === "ERROR" ? (
                  <span>err</span>
                ) : (
                  <p className="font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
                    {format(cycleDates.start, "MMM")}{" "}
                    {format(cycleDates.start, "do")} -{" "}
                    {format(cycleDates.end, "MMM")}{" "}
                    {format(cycleDates.end, "do")}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              {cycleDates.status === "LOADING" ? (
                <span>--/--/--</span>
              ) : cycleDates.status === "ERROR" ? (
                <span>err </span>
              ) : (
                <div className="pt-3 flex flex-col gap-3">
                  <p className="font-bold dark:text-breadgray-ultra-white">
                    Distributing in{" "}
                    {differenceInDays(cycleDates.end, new Date())} days
                  </p>
                  <div className="flex gap-0.5 bg-breadgray-white border-breadgray-white dark:bg-black border-2 dark:border-black rounded-full overflow-clip">
                    {completedDays &&
                      completedDays.map((isComplete, i) => {
                        return (
                          <div
                            key={`day_${i}`}
                            className={clsx(
                              "grow",
                              isComplete
                                ? "text-breadpink-500"
                                : "text-breadgray-grey dark:text-breadgray-rye"
                            )}
                          >
                            <svg
                              className="w-full"
                              viewBox="0 0 100 100"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                className="fill-current"
                                width="100"
                                height="100"
                                shapeRendering="geometricPrecision"
                              />
                            </svg>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
            <div>
              <a
                className="flex items-center gap-2 text-sm font-medium pt-4 text-breadgray-grey100 dark:text-breadgray-ultra-white"
                href="https://breadchain.notion.site/BREAD-Voting-Power-UI-0f2d350320b94e4ba9aeec2ef6fdcb84"
                target="_blank"
                rel="noopener noreferrer"
              >
                How does this work?
                <div className="text-breadpink-shaded">
                  <LinkIcon />
                </div>
              </a>
            </div>
          </div>
        </CardBox>
      </div>
    </div>
  );
}
