"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { TSwapMode, TSwapState } from "../bakery/components/Swap/Panel";
import { SWAP_WIDGET_ANCHOR_ID } from "./HomeBanner";

const NewSwap = dynamic(() => import("../bakery/components/Swap/NewSwap"), {
	ssr: false,
});

const initialSwapState: TSwapState = {
	mode: "BAKE",
	value: "",
};

const VALID_MODES: TSwapMode[] = ["BAKE", "BURN", "BRIDGE", "BUY"];

function readModeFromHash(): TSwapMode | null {
	if (typeof window === "undefined") return null;
	const hash = window.location.hash.replace(/^#/, "").toUpperCase();
	return (VALID_MODES as string[]).includes(hash) ? (hash as TSwapMode) : null;
}

export default function SwapWrapper() {
	const [swapState, setSwapState] = useState<TSwapState>(initialSwapState);

	useEffect(() => {
		const mode = readModeFromHash();
		if (mode) setSwapState({ mode, value: "" });

		const onHashChange = () => {
			const next = readModeFromHash();
			if (next) setSwapState({ mode: next, value: "" });
		};
		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange);
	}, []);

	return (
		<div id={SWAP_WIDGET_ANCHOR_ID}>
			<NewSwap swapState={swapState} setSwapState={setSwapState} />
		</div>
	);
}
