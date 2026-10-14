"use client";

import {
	FALLBACK_CLAIMABLE_YIELD,
	useClaimableYield,
} from "@/app/governance/useClaimableYield";
import { Body, Heading3, Logo } from "@breadcoop/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { formatBalance } from "@/app/core/util/formatter";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { ERC20_ABI, SDAI_ADAPTOR_ABI } from "@/abi";
import { formatUnits } from "viem";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { FALLBACK_APY_VALUE, useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { useAnimatedNumber } from "@/app/components/animated-number";

interface Response {
	_col0: number;
}

// More than 60k has been distributed, so this stays just under the real total.
const FALLBACK_TOTAL_BREAD_DISTRIBUTED = 60000;


export const Interest = () => {
	const { claimableYield } = useClaimableYield();
	const chainConfig = useActiveChain();
	const [yieldIncrement, setYieldIncrement] = useState(0);

	const {
		data: totalBreadDistributed = FALLBACK_TOTAL_BREAD_DISTRIBUTED,
		isPending: totalBreadDistributedPending,
		error: totalBreadDistributedError,
	} = useQuery({
		queryKey: ["total-bread-distributed"],
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
		queryFn: async () => {
			try {
				const req = await fetch("/api/total-bread-distributed");

				if (!req.ok) throw Error("Try again");

				return ((await req.json()) as Response)._col0;
			} catch (error) {
				throw Error("Try again");
			}
		},
	});

	const { data: apyData = FALLBACK_APY_VALUE, status: apyStatus } =
		useVaultAPY();

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
			const totalSupply = Number(
				formatUnits(totalSupplyData as bigint, 18)
			);
			const yieldPerDay = (totalSupply * dsr) / 365;
			const yieldPerHour = yieldPerDay / 24;

			return yieldPerHour;
		}
		return null;
	}, [apyStatus, apyData, totalSupplyStatus, totalSupplyData]);

	// const totalInterest = useMemo(() => {
	// 	if (claimableYield === null) return null;

	// 	if (totalBreadDistributed) return totalBreadDistributed + claimableYield;

	// 	if (Boolean(totalBreadDistributedError))
	// 		return FALLBACK_TOTAL_BREAD_DISTRIBUTED + claimableYield;

	// 	return null;
	// }, [totalBreadDistributed, totalBreadDistributedError, claimableYield]);

	const totalInterest = useMemo(() => {
		const _claim = claimableYield || FALLBACK_CLAIMABLE_YIELD;

		return totalBreadDistributed + _claim;
	}, [totalBreadDistributed, claimableYield]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (claimableYield !== null && yieldPerHour) {
			intervalId = setInterval(() => {
				setYieldIncrement(
					(val) => (val += (yieldPerHour / 60 / 60) * 1.5)
				);
			}, 1500);
		}
		return () => clearInterval(intervalId);
	}, [claimableYield, yieldPerHour]);

	// const displayValue = useMemo(() => {
	// 	if (totalInterest !== null) {
	// 		return totalInterest + yieldIncrement;
	// 	}
	// 	return null;
	// }, [totalInterest, yieldIncrement]);

	const displayValue = useMemo(
		() => totalInterest + yieldIncrement,
		[totalInterest, yieldIncrement]
	);

	// One animated value drives the whole number, the decimals and the USD line,
	// so they count up together from 0 instead of the decimals and USD jumping
	// straight to the fallback figure.
	const animatedValue = useAnimatedNumber(displayValue, {
		loading: totalBreadDistributedPending || claimableYield === null,
		placeholder:
			FALLBACK_TOTAL_BREAD_DISTRIBUTED + FALLBACK_CLAIMABLE_YIELD,
		persistKey: "total-funding",
	});
	// Reserve room for the final number (an invisible copy of the widest value),
	// so the layout doesn't shift as the digits count up.
	const widestValue = Math.max(
		FALLBACK_TOTAL_BREAD_DISTRIBUTED + FALLBACK_CLAIMABLE_YIELD,
		displayValue,
		animatedValue
	);
	const renderTotal = (val: number) => {
		const [whole, decimals] = formatBalance(val, 4).split(".");
		return (
			<>
				<span className="text-h1 md:text-[4rem] lg:text-[5rem]">
					{whole}
				</span>
				<span className="text-h2 !text-2xl text-surface-grey-2 relative top-1.5 left-[-0.1rem] md:top-[-0.6rem] lg:top[0rem] xl:top-[-0.1rem]">
					.{decimals}
				</span>
			</>
		);
	};
	const totalClasses =
		"flex items-end justify-start flex-nowrap xl:block [grid-area:1/1]";

	return (
		<>
			<div className="flex items-start justify-end md:justify-start">
				<Logo
					variant="line"
					className="mr-2 shrink-0 w-[clamp(2rem,calc(1.1rem+4.5vw),4.0625rem)] md:mr-1 md:self-center md:mb-8 lg:w-[4.0625rem] lg:h-[4.0625rem] lg:mr-3"
				/>
				<div>
					<div className="grid tabular-nums">
						<p className={`${totalClasses} invisible`} aria-hidden="true">
							{renderTotal(widestValue)}
						</p>
						<p className={totalClasses}>{renderTotal(animatedValue)}</p>
					</div>
					<Body className="text-surface-grey ml-auto max-w-max md:mt-[-0.6rem] lg:mt-[-0.8rem]">
						($ {animatedValue.toFixed(2)} USD)
					</Body>
				</div>
			</div>
			{/* <div className="flex flex-col items-end mb-6">
        <div className="flex items-center justify-start md:mr-auto">
          <Logo
            variant="line"
            className="mr-4 md:mr-1 lg:w-[4.0625rem] lg:h-[4.0625rem]"
          />
          <p className="flex items-end justify-start flex-nowrap xl:block">
            <span className="text-h1 md:text-[5rem]">
              {formattedValue[0]}
            </span>
            <span className="text-h2 !text-2xl text-surface-grey-2 relative top-1.5 md:left-0 md:top-[-0.4rem] xl:top-[-0.1rem]">
              .{formattedValue[1]}
            </span>
          </p>
        </div>
        <Body className="text-surface-grey md:mr-auto md:w-full md:max-w-[367.63px] md:text-right md:-mt-2 lg:max-w-[25rem]">
          ($ {displayValue?.toFixed(2) || "--"} USD)
        </Body>
      </div> */}
			<Heading3 className="text-2xl">Total funding generated</Heading3>
			<Body className="text-surface-grey text-xs mb-3">
				This is the total interest accumulated since start of the fund
				in $BREAD.*
			</Body>
		</>
	);
};
