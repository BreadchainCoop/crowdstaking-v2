"use client";

import { XDAIIcon } from "@/app/core/components/Icons/TokenIcons";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { Body, Heading3, Logo } from "@breadcoop/ui";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { TSwapMode } from "../Swap/interfaces";

const GAS_FLOOR = 0.001;

function ActionButton({
	children,
	transparent,
	tab,
}: {
	children: ReactNode;
	transparent?: boolean;
	tab: TSwapMode;
}) {
	const router = useRouter();
	const onClick = () => {
		// v is to force a re-render of the swapper
		router.replace(`/?tab=${tab}&v=${Date.now()}#swapper`);
		document
			.getElementById("swapper")
			?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<button
			onClick={onClick}
			type="button"
			className={`inline-flex items-center justify-center gap-2 rounded-full text-sm px-5 py-2 font-bold tracking-wider border-2 shadow-[0_2px_0_rgba(0,0,0,0.18)] hover:-translate-y-px hover:shadow-[0_3px_0_rgba(0,0,0,0.2)] active:translate-y-px active:shadow-none transition-all ${transparent ? "bg-breadviolet-shaded text-white border-breadviolet-shaded" : "bg-white text-primary-orange border-white"}`}
		>
			{children}
		</button>
	);
}

// function Title({ title }: { title: string }) {
// 	return <Body className="text-white text-sm">{title}</Body>;
// }

// function Description({ desc }: { desc: string }) {
// 	return <Body className="text-xs text-white/90 mb-2 sm:mb-0">{desc}</Body>;
// }

function Content({ title, desc }: { title: string; desc: string }) {
	return (
		<div className="sm:mr-auto md:flex md:flex-row md:items-center md:justify-start md:gap-2 md:flex-wrap">
			<Body bold className="text-white text-sm">
				{title}
			</Body>
			<Body className="text-xs text-white/90 mb-2 sm:mb-0">{desc}</Body>
		</div>
	);
}

export function BalanceBanner() {
	const { user } = useConnectedUser();
	const { xDAI, BREAD } = useTokenBalances();

	if (!(user.status === "CONNECTED" || user.status === "UNSUPPORTED_CHAIN"))
		return null;

	if (xDAI?.status !== "SUCCESS" || BREAD?.status !== "SUCCESS") return null;

	const xdaiBalance = parseFloat(xDAI.value);
	const breadBalance = parseFloat(BREAD.value);

	console.log({ XDAI: xDAI.value, bread: BREAD.value });

	let mode: "xdai" | "bread" | null = null;

	if (xdaiBalance < GAS_FLOOR) {
		mode = "xdai";
	} else if (breadBalance === 0) {
		mode = "bread";
	}

	if (mode === null) return null;

	return (
		<section className="w-full bg-primary-orange mb-6 md:mb-8">
			<div className="max-w-6xl mx-auto px-4 py-2 flex flex-col sm:gap-2 sm:flex-row sm:items-center sm:justify-center md:px-8">
				{mode === "bread" ? (
					<>
						<div className="hidden sm:inline-block">
							<Logo variant="square" size={24} />
						</div>
						<Content
							title="Ready to bake?"
							desc="You have xDAI but no BREAD yet. Bake BREAD to join the Solidarity Fund and support a worker-owned future."
						/>
						<ActionButton tab="BAKE">Bake Bread</ActionButton>
					</>
				) : (
					<>
						<div className="hidden sm:inline-block">
							<XDAIIcon />
						</div>
						<Content
							title="You need xDAI to bake"
							desc="xDAI pays for gas on Gnosis Chain. Bridge in from another chain or buy with fiat to get started."
						/>
						<div className="flex items-center justify-start gap-2">
							<ActionButton tab="BRIDGE" transparent>
								Bridge
							</ActionButton>
							<ActionButton tab="BUY">Buy</ActionButton>
						</div>
					</>
				)}
			</div>
		</section>
	);
}
