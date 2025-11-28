"use client";

import { Body } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { FALLBACK_APY_VALUE, useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { formatUnits } from "viem";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import AnimatedNumber from "@/app/components/animated-number";

const formatter = (val: number) => val.toFixed(1);

export const Apy = () => {
	const { data } = useVaultAPY();

	const apy = data
		? Number(formatUnits(data as bigint, 18)) * 100
		: FALLBACK_APY_VALUE;

	return (
		<ExternalLink
			href="https://app.spark.fi/savings/gnosis/sdai"
			className="!text-current shrink-0"
		>
			<Chip className="max-w-max gap-x-2.5 bg-paper-main hover:bg-[#EA581733] transition-colors">
				<ChartLine />
				<Body bold>
					<AnimatedNumber value={apy} formatter={formatter} />% APY
				</Body>
			</Chip>
		</ExternalLink>
	);
};

function ChartLine() {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M21 19.5H3V4.5"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M21 9L15 14.25L9 9.75L3 15"
				stroke="#EA5817"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
