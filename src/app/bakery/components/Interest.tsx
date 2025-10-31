"use client";

import { useClaimableYield } from "@/app/governance/useClaimableYield";
import { Body, Heading3, Logo } from "@breadcoop/ui";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { formatBalance } from "@/app/core/util/formatter";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { useReadContract } from "wagmi";
import { ERC20_ABI, SDAI_ADAPTOR_ABI } from "@/abi";
import { formatUnits } from "viem";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { useVaultAPY } from "@/app/core/hooks/useVaultAPY";

interface Response {
	_col0: number;
}

export const Interest = () => {
	const { claimableYield } = useClaimableYield();
	const chainConfig = useActiveChain();
	const [yieldIncrement, setYieldIncrement] = useState(0);

	const { data: totalBreadDistributed, error } = useQuery({
		queryKey: ["total-bread-distributed"],
		queryFn: async () => {
			const res = (await (
				await fetch("/api/total-bread-distributed")
			).json()) as Response;

			return res._col0;
		},
	});

	const { data: apyData, status: apyStatus } = useVaultAPY();

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

	const totalInterest = useMemo(() => {
		if (totalBreadDistributed !== undefined && claimableYield !== null) {
			return totalBreadDistributed + claimableYield;
		}
		return null;
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

	const displayValue = useMemo(() => {
		if (totalInterest !== null) {
			return totalInterest + yieldIncrement;
		}
		return null;
	}, [totalInterest, yieldIncrement]);

	const formattedValue = formatBalance(displayValue || 0, 4).split(".");

	return (
		<>
			<div className="flex flex-col items-end mb-6">
				<div className="flex items-center justify-start md:mr-auto">
					<Logo variant="line" className="mr-4" />
					<p className="flex items-end justify-start flex-nowrap xl:block">
						<span className="text-h1 md:text-[5rem]">{formattedValue[0]}</span>
						<span className="text-h2 !text-2xl text-surface-grey-2 relative top-1.5 md:left-0 md:top-[-0.4rem] xl:top-[-0.1rem]">
							.{formattedValue[1]}
						</span>
					</p>
				</div>
				<Body className="text-surface-grey md:mr-auto md:w-full md:max-w-[379.63px] md:text-right">($ {displayValue?.toFixed(2) || "--"} USD)</Body>
			</div>
			<Heading3 className="text-2xl">
				Interest generated overtime
			</Heading3>
			<Body className="text-surface-grey text-xs mb-3">
				This is the total interest accumulated since start of the fund
				in $BREAD.*
			</Body>
		</>
	);
};
