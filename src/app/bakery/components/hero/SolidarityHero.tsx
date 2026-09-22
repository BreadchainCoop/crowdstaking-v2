"use client";

import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { Body, Heading4 } from "@breadcoop/ui";
import {
	ChartLineUpIcon,
	CoinVerticalIcon,
	UsersThreeIcon,
} from "@phosphor-icons/react";

import { ERC20_ABI } from "@/abi";
import { BREAD_ADDRESS } from "@/constants";
import { useRefetchOnBlockChange } from "@/app/core/hooks/useRefetchOnBlockChange";
import { FALLBACK_APY_VALUE, useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { HeroImageCarousel } from "./HeroImageCarousel";
import { SupportFundButton } from "./SupportFundButton";

// Where each stat links out to (on-chain / Dune), matching the existing widgets.
const DUNE_URL = "https://dune.com/bread_cooperative/solidarity";
const SPARK_URL = "https://app.spark.fi/savings/gnosis/sdai";

// Last-known values, so the hero renders before/without the live sources —
// mirrors the fallbacks the existing hero widgets each keep.
const FALLBACK_CIRCULATION = 458485;
const FALLBACK_BACKERS = 209;
const FALLBACK_DISTRIBUTED = 46548;

// BREAD is 1:1 with USD, so the token amount is shown directly as USD.
const usd = (n: number) =>
	n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function HeroStatChip({
	icon,
	value,
	label,
	href,
}: {
	icon: ReactNode;
	value: string;
	label: string;
	href: string;
}) {
	return (
		<ExternalLink href={href} className="block !text-current">
			<div className="flex items-center justify-center gap-2 border border-[#eae2d6] bg-paper-0 px-3 py-2.5 transition-colors hover:border-primary-orange hover:bg-[#EA581714]">
				<span className="shrink-0 text-primary-orange">{icon}</span>
				<Body bold className="text-surface-ink">
					{value}
				</Body>
				<Body className="text-surface-grey text-sm">{label}</Body>
			</div>
		</ExternalLink>
	);
}

export function SolidarityHero() {
	// Headline: current circulated BREAD (same source as BreadCirculation).
	const { data: supplyData } = useRefetchOnBlockChange(
		BREAD_ADDRESS,
		ERC20_ABI,
		"totalSupply",
		[]
	);
	const circulated = supplyData
		? parseInt(formatUnits(supplyData as bigint, 18))
		: FALLBACK_CIRCULATION;

	const { data: apyRaw = FALLBACK_APY_VALUE } = useVaultAPY();
	const apy = Number(formatUnits(apyRaw, 18)) * 100;

	// Same query keys as the existing widgets, so TanStack dedupes the fetches.
	const { data: backers = FALLBACK_BACKERS } = useQuery({
		queryKey: ["bread-backers"],
		queryFn: async () =>
			(
				(await (await fetch("/api/bread-backers")).json()) as {
					_col0: number;
				}
			)._col0,
	});
	const { data: distributed = FALLBACK_DISTRIBUTED } = useQuery({
		queryKey: ["total-bread-distributed"],
		queryFn: async () =>
			(
				(await (await fetch("/api/total-bread-distributed")).json()) as {
					_col0: number;
				}
			)._col0,
	});

	return (
		// Full-bleed hero. Mobile: full-viewport image with a centered card on
		// top. Desktop: 50/50 split — image fills the left half (full height,
		// cropped), content is a fixed-width column on the right.
		<section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden md:grid md:min-h-[calc(100vh-6rem)] md:grid-cols-2 md:items-stretch md:justify-normal md:overflow-visible">
			<HeroImageCarousel className="absolute inset-0 h-full w-full md:relative md:inset-auto md:order-1 md:h-full md:w-full" />

			{/* Content — a card centered (x + y) over the image on mobile (z-10
			    lifts it above); on desktop a fixed-width column on the right,
			    vertically centered, with z dropped so the header dropdown overlays. */}
			<div className="relative z-10 mx-4 max-w-md bg-paper-0 p-6 shadow-[0px_4px_12px_0px_#1B201A26] md:order-2 md:z-auto md:mx-0 md:flex md:max-w-none md:items-center md:bg-transparent md:p-0 md:px-8 md:shadow-none lg:px-16">
				<div className="flex flex-col gap-4 md:w-[28rem] md:max-w-full">
					{/* Same font + weight as the "We decide, together." heading
					    (text-h2 = font-breadDisplay font-[900]). */}
					<p className="font-breadDisplay font-[900] tracking-tighter text-5xl leading-none text-surface-ink md:text-6xl lg:text-7xl">
						{usd(circulated)}
						<span className="text-2xl text-surface-grey-2 md:text-3xl">
							.00
						</span>
					</p>
					<Heading4 className="text-surface-brown">
						Dedicated to funding human resilience.
					</Heading4>

					<SupportFundButton className="w-full" />

					<div className="grid gap-2 sm:grid-cols-3">
						<HeroStatChip
							icon={<CoinVerticalIcon size={20} />}
							value={usd(distributed)}
							label="Distributed"
							href={DUNE_URL}
						/>
						<HeroStatChip
							icon={<UsersThreeIcon size={20} />}
							value={backers.toLocaleString("en-US")}
							label="Supporters"
							href={DUNE_URL}
						/>
						<HeroStatChip
							icon={<ChartLineUpIcon size={20} />}
							value={`${apy.toFixed(1)}%`}
							label="APY"
							href={SPARK_URL}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
