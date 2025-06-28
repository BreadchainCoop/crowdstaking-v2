"use client";

import type { WidgetConfig } from "@lifi/widget";
import { LiFiWidget, WidgetSkeleton } from "@lifi/widget";
import { LiFiWrapper } from "./LiFiWrapper";

export function Bridge() {
  const config = {
    appearance: "light",
    // initialize to xDai on Gnosis chain
    toToken: "0x0000000000000000000000000000000000000000",
    toChain: 100,
    theme: {
      container: {
        boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
        borderRadius: "16px",
      },
    },
  } as Partial<WidgetConfig>;

  return (
    <div>
      <LiFiWrapper fallback={<WidgetSkeleton config={config} />}>
        <LiFiWidget config={config} integrator="nextjs-example" />
      </LiFiWrapper>
    </div>
  );
}
