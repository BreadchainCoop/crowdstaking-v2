"use client";

import dynamic from "next/dynamic";
import type { TSwapMode } from "../bakery/components/Swap/Panel";

const BalanceBanner = dynamic(
	() =>
		import("../bakery/components/Banners/BalanceBanner").then(
			(m) => m.BalanceBanner
		),
	{ ssr: false }
);

export const SWAP_WIDGET_ANCHOR_ID = "swap-widget";

export default function HomeBanner() {
	const handleSelectTab = (mode: TSwapMode) => {
		if (typeof window === "undefined") return;
		window.location.hash = mode.toLowerCase();
		const el = document.getElementById(SWAP_WIDGET_ANCHOR_ID);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return <BalanceBanner onSelectTab={handleSelectTab} />;
}
