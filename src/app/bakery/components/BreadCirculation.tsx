"use client";

import { Body, Logo } from "@breadcoop/ui";
import { Chip } from "./Chip";
import { formatSupply } from "@/app/core/util/formatter";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { BREAD_ADDRESS } from "@/constants";
import { ERC20_ABI } from "@/abi";
import { formatUnits } from "viem";
import AnimatedNumber from "@/app/components/animated-number";

// const FALLBACK_CIRCULATION_VALUE = 400000.260468292593460802; // use to test animation
// Value as at when I ran the query
const FALLBACK_CIRCULATION_VALUE = 458485.260468292593460802;

export const BreadCirculation = () => {
	const { data } = useRefetchOnBlockChange(
		BREAD_ADDRESS,
		ERC20_ABI,
		"totalSupply",
		[]
	);

	const supply = data
		? parseInt(formatUnits(data as bigint, 18))
		: FALLBACK_CIRCULATION_VALUE;

	return (
		<ExternalLink
			href="https://gnosisscan.io/token/0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3"
			className="!text-current shrink-0"
		>
			<Chip className="max-w-max mb-4 !gap-x-2.5 bg-paper-main hover:bg-[#EA581733] transition-colors md:mb-0">
				<Logo className="md:size-6" size={24} />
				<Body bold className="flex items-center justify-center gap-1">
					<AnimatedNumber value={supply} formatter={formatSupply} />{" "}
					BREAD <span className="font-normal">in circulation</span>
				</Body>
			</Chip>
		</ExternalLink>
	);
};
