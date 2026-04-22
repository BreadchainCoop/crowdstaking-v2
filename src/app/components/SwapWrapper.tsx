"use client";

import dynamic from "next/dynamic";

const NewSwap = dynamic(() => import("../bakery/components/Swap/NewSwap"), {
	ssr: false,
});

export default function SwapWrapper() {
	return <NewSwap />;
}
