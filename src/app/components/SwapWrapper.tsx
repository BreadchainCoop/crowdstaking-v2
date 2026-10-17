"use client";

import dynamic from "next/dynamic";
import type { Hex } from "viem";

const NewSwap = dynamic(() => import("../bakery/components/Swap/NewSwap"), {
	ssr: false,
});

export default function SwapWrapper({
  /** Pre-select this token as the bridge/swap source (e.g. EURe → xDAI). */
  fromToken,
}: {
  fromToken?: Hex;
}) {
  return <NewSwap fromToken={fromToken} />;
}
