"use client";

import dynamic from "next/dynamic";

const Swap = dynamic(() => import("../bakery/components/Swap/Swap"), {
  ssr: false,
});

export default function SwapWrapper() {
  return <Swap />;
}
