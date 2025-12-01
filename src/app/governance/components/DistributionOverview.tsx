import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { formatBalance } from "@/app/core/util/formatter";
import { CycleDatesState } from "../useCycleDates";
import { useClaimableYield } from "../useClaimableYield";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import Tooltip from "@/app/core/components/Tooltip";
import { CardBox } from "@/app/core/components/CardBox";
import { useReadContract } from "wagmi";
import { Heading2, Heading4, Body, Logo } from "@breadcoop/ui";
import { ERC20_ABI, SDAI_ADAPTOR_ABI } from "@/abi";
import { useEffect, useMemo, useState } from "react";
import { differenceInDays, differenceInHours, format, isAfter, isBefore } from "date-fns";

import { formatUnits } from "viem";
import clsx from "clsx";
import { useDistributions } from "../useDistributions";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { HowDoesThisWorkButton } from "@/app/core/components/HowDoesThisWorkButton";

export function DistributionOverview({
  cycleDates,
}: {
  cycleDates: CycleDatesState;
}) {
  const { totalDistributions: distributions } = useDistributions(0);
  const { claimableYield } = useClaimableYield();
  const [dsrAPY, setDsrAPY] = useState("");
  const chainConfig = useActiveChain();
  const [yieldIncrement, setYieldIncrement] = useState(0);

  const { data: apyData, status: apyStatus } = useReadContract({
    address: chainConfig.SDAI_ADAPTOR.address,
    abi: SDAI_ADAPTOR_ABI,
    functionName: "vaultAPY",
    chainId: chainConfig.ID,
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

  // const completedDays = useMemo(() => {
  //   if (cycleDates.status !== "SUCCESS") return null;
  //   const daysRemaining = differenceInDays(cycleDates.end, new Date());
  //   const totalDaysCount = differenceInDays(cycleDates.end, cycleDates.start);
  //   const days: boolean[] = [];
  //   for (let i = 0; i < totalDaysCount; i++) {
  //     days.unshift(i >= daysRemaining);
  //   }
  //   return days;
  // }, [cycleDates]);

  return (
		<div className="col-span-12 lg:col-span-4 row-start-2 lg:row-start-1 lg:row-span-2">
			<div className="flex justify-center lg:block lg:w-full">
				<CardBox className="lg:border-transparent">
					<div className="max-w-96 m-auto lg:max-w-full flex flex-col items-center justify-center p-5 shadow-card">
						<Heading4 className="text-surface-grey-2 text-[24px] text-center">
							Amount to distribute
						</Heading4>
						<div className="pt-4 pb-6 w-full items-center">
							{claimableYield !== null ? (
								<div className="w-full flex justify-center items-baseline">
									<div className="flex gap-2 justify-end items-baseline">
										<Logo size={32} />
										<Heading2 className="text-[48px]">
											{
												formatBalance(
													claimableYield +
														yieldIncrement,
													4
												).split(".")[0]
											}
										</Heading2>
									</div>
									<Body
										bold
										className="text-[48px] text-surface-grey-2"
									>
										.
									</Body>
									<Heading2 className="text-[24px] w-[56px] text-surface-grey-2">
										{
											formatBalance(
												claimableYield + yieldIncrement,
												4
											).split(".")[1]
										}
									</Heading2>
								</div>
							) : (
								<div className="text-3xl opacity-0">.</div>
							)}

							<div className="flex justify-center pt-1">
								<Body className="text-surface-grey me-2">
									Current accumulated interest
								</Body>
								<Tooltip>
									Based on the current DAI savings rate of{" "}
									{dsrAPY + "% "}
									applied on the total baked $BREAD on Gnosis
									chain.
								</Tooltip>
							</div>
						</div>
						<div className="w-full flex flex-col gap-3 py-3 border-t border-t-primary-orange border-b border-b-primary-orange">
							<div className="flex w-full">
								<Body className="grow text-surface-grey">
									Est. after 30 days
								</Body>
								<div className="flex gap-2 items-center md:justify-center">
									<Logo size={16} />
									<Body bold>
										{estimateTotal
											? formatBalance(estimateTotal, 2)
											: "--.--"}
									</Body>
								</div>
							</div>
							<div className="flex w-full">
								<Body className="grow text-surface-grey">
									Annual interest rate (APY)
								</Body>
								<div className="flex gap-2 items-center md:justify-center">
									<Body bold>{dsrAPY + "%"}</Body>
								</div>
							</div>
							<div className="flex w-full gap-2">
								<Body className="grow text-surface-grey">
									Voting cycle #
									{distributions == undefined
										? "--"
										: distributions + 1}
								</Body>
								{cycleDates.status === "LOADING" ? (
									<span>--</span>
								) : cycleDates.status === "ERROR" ? (
									<span>err</span>
								) : (
									<Body bold>
										{format(cycleDates.start, "MMM")}{" "}
										{format(cycleDates.start, "do")} -{" "}
										{format(cycleDates.end, "MMM")}{" "}
										{format(cycleDates.end, "do")}
									</Body>
								)}
							</div>
						</div>
						<div className="w-full">
							{cycleDates.status === "LOADING" ? (
								<span>--/--/--</span>
							) : cycleDates.status === "ERROR" ? (
								<span>err </span>
							) : (
								<div className="pt-3 flex flex-col gap-2">
									<Body bold>
										<span className="text-surface-grey">
											Distributing in{" "}
										</span>
										{Math.max(0, differenceInDays( cycleDates.end, new Date()))}{" "}
										days
									</Body>
									<CycleProgressBar start={cycleDates.start} end={cycleDates.end} />
									{/* <div className="flex gap-0.5 border border-black overflow-clip p-1">
										{completedDays &&
											completedDays.map(
												(isComplete, i) => {
													return (
														<div
															key={`day_${i}`}
															className={clsx(
																"grow",
																isComplete
																	? "text-primary-orange"
																	: "text-paper-main"
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
												}
											)}
									</div> */}
								</div>
							)}
						</div>
						<div className="mt-6">
							<HowDoesThisWorkButton href="https://docs.bread.coop/solidarity-primitives/crowdstaking/yield-governance/voting-power" />
						</div>
					</div>
				</CardBox>
			</div>
		</div>
  );
}

interface CycleProgressBarProps {
  start: Date;
  end: Date;
}

export default function CycleProgressBar({ start, end }: CycleProgressBarProps) {
  const today = new Date();
  
  const effectiveToday = isBefore(today, start) 
    ? start 
    : isAfter(today, end) 
      ? end 
      : today;

  const totalDays = differenceInDays(end, start);
  const daysPassed = differenceInDays(effectiveToday, start);
  const percentage = Math.round((daysPassed / totalDays) * 100);

  return (
    <div className="p-1 border border-black h-[1.0625rem]">
      <div className="bg-[#EA5817] h-full" style={{ width: `${percentage}%` }} />
    </div>
  );
}
