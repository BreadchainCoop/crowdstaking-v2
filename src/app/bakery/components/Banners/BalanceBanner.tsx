"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { Logo } from "@breadcoop/ui";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { XDAIIcon } from "@/app/core/components/Icons/TokenIcons";
import type { TSwapMode } from "../Swap/Panel";
import { ArrowIcon } from "./Shared";

const GAS_FLOOR = 0.001;

type BalanceBannerProps = {
	onSelectTab: (mode: TSwapMode) => void;
};

export function BalanceBanner({ onSelectTab }: BalanceBannerProps) {
	const { user } = useConnectedUser();
	const { xDAI, BREAD } = useTokenBalances();

	if (user.status !== "CONNECTED") return null;
	if (!xDAI || xDAI.status !== "SUCCESS") return null;
	if (!BREAD || BREAD.status !== "SUCCESS") return null;

	const xdaiBalance = parseFloat(xDAI.value);
	const breadBalance = parseFloat(BREAD.value);

	if (xdaiBalance < GAS_FLOOR) {
		return <NoGasBanner onSelectTab={onSelectTab} />;
	}

	if (breadBalance === 0) {
		return <NoBreadBanner onSelectTab={onSelectTab} />;
	}

	return null;
}

function NoGasBanner({ onSelectTab }: BalanceBannerProps) {
	const title = "You need xDAI to bake";
	const description =
		"xDAI pays for gas on Gnosis Chain. Bridge in from another chain or buy with fiat to get started.";

	return (
		<FullWidthBand>
			{/* large */}
			<div className="hidden gap-3 w-full sm:flex items-center">
				<div className="shrink-0">
					<XDAIIcon />
				</div>
				<InlineText title={title} description={description} />
				<div className="flex gap-2 items-center shrink-0">
					<PillButton
						variant="secondary"
						onClick={() => onSelectTab("BRIDGE")}
					>
						Bridge
					</PillButton>
					<PillButton
						variant="primary"
						onClick={() => onSelectTab("BUY")}
					>
						Buy
					</PillButton>
				</div>
			</div>
			{/* small */}
			<div className="sm:hidden flex flex-col gap-2 w-full">
				<StackedText title={title} description={description} />
				<div className="flex gap-2">
					<PillButton
						variant="secondary"
						onClick={() => onSelectTab("BRIDGE")}
						withArrow
					>
						Bridge
					</PillButton>
					<PillButton
						variant="primary"
						onClick={() => onSelectTab("BUY")}
						withArrow
					>
						Buy
					</PillButton>
				</div>
			</div>
		</FullWidthBand>
	);
}

function NoBreadBanner({ onSelectTab }: BalanceBannerProps) {
	const title = "Ready to bake?";
	const description =
		"You have xDAI but no BREAD yet. Bake BREAD to join the Solidarity Fund and support a worker-owned future.";

	return (
		<FullWidthBand>
			{/* large */}
			<div className="hidden gap-3 w-full sm:flex items-center">
				<div className="shrink-0">
					<Logo variant="square" size={24} />
				</div>
				<InlineText title={title} description={description} />
				<div className="shrink-0">
					<PillButton
						variant="primary"
						onClick={() => onSelectTab("BAKE")}
					>
						Bake BREAD
					</PillButton>
				</div>
			</div>
			{/* small */}
			<div className="sm:hidden flex flex-col gap-2 w-full">
				<StackedText title={title} description={description} />
				<PillButton
					variant="primary"
					onClick={() => onSelectTab("BAKE")}
				>
					Bake BREAD
				</PillButton>
			</div>
		</FullWidthBand>
	);
}

function InlineText({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex items-baseline gap-2 grow min-w-0">
			<span className="text-sm font-bold text-white whitespace-nowrap">
				{title}
			</span>
			<span className="text-sm text-white/90 truncate">{description}</span>
		</div>
	);
}

function StackedText({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col">
			<span className="text-sm font-bold text-white">{title}</span>
			<span className="text-xs text-white/90">{description}</span>
		</div>
	);
}

function FullWidthBand({ children }: { children: ReactNode }) {
	return (
		<div className="w-full bg-primary-orange mb-6 md:mb-8">
			<div className="max-w-6xl mx-auto px-4 md:px-8 py-2">{children}</div>
		</div>
	);
}

function PillButton({
	children,
	onClick,
	variant,
	withArrow = false,
}: {
	children: string;
	onClick: () => void;
	variant: "primary" | "secondary";
	withArrow?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				"flex items-center justify-center gap-2 rounded-full text-sm px-5 py-2 font-bold tracking-wider border-2 shadow-[0_2px_0_rgba(0,0,0,0.18)] hover:-translate-y-[1px] hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all",
				variant === "primary" &&
					"bg-white text-primary-orange border-white",
				variant === "secondary" &&
					"bg-breadviolet-shaded text-white border-breadviolet-shaded dark:bg-breadpink-shaded dark:border-breadpink-shaded dark:text-breadgray-grey100"
			)}
		>
			<span>{children}</span>
			{withArrow && <ArrowIcon />}
		</button>
	);
}
