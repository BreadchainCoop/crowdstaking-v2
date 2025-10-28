"use client";

import dynamic from "next/dynamic";
import NewSwap from "../bakery/components/Swap/NewSwap";

const Swap = dynamic(() => import("../bakery/components/Swap/Swap"), {
	ssr: false,
});

export default function SwapWrapper() {
	return (
		<>
			{/* <Swap /> */}
			<NewSwap />
		</>
	);
}
