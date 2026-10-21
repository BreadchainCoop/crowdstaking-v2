"use client";

import type { Route, RouteExecutionUpdate, WidgetConfig } from "@lifi/widget";
import {
  LiFiWidget,
  useWidgetEvents,
  WidgetEvent,
  WidgetSkeleton,
} from "@lifi/widget";
import { LiFiWrapper } from "./LiFiWrapper";
import { useEffect, useMemo } from "react";
import type { Hex } from "viem";
import { useModal } from "@/app/core/context/ModalContext";
import { useToast } from "@/app/core/context/ToastContext/ToastContext";
import { lifiConfig } from "@/lib/lifi";

export function Bridge({
  /** Optional token to pre-select as the swap source on Gnosis (e.g. EURe → xDAI). */
  fromToken,
}: {
  fromToken?: Hex;
}) {
  /*
  From LiFi Docs (https://docs.li.fi/widget/widget-events#list-of-events)
  To minimize unnecessary re-renders and prevent potential glitches in the main Widget component, please integrate the useWidgetEvents hook outside of the component where the main LiFiWidget is integrated.
  */
  const widgetEvents = useWidgetEvents();
  const { setModal } = useModal();
  const { toastDispatch } = useToast();

  useEffect(() => {
    const onRouteExecutionCompleted = (route: Route) => {
      console.log("__ BRIDGE COMPLETED __", route);
      setModal({ type: "LIFI_BRIDGE", route });
    };
    const onRouteExecutionFailed = (update: RouteExecutionUpdate) => {
      console.log("__ LIFI BRIDGE FIALED __", update.process, {
        error: update.process.error,
        message: update.process.message,
      });
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "error",
          message:
            update.process.error?.message ||
            "Transaction failed, try again later!",
        },
      });
    };

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);

    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return <LiFiMainWrapper fromToken={fromToken} />;
}

function LiFiMainWrapper({ fromToken }: { fromToken?: Hex }) {
  const config = useMemo<Partial<WidgetConfig>>(
    () =>
      fromToken
        ? { ...lifiConfig, fromToken, fromChain: 100 }
        : lifiConfig,
    [fromToken]
  );

  return (
		<div>
			<LiFiWrapper fallback={<WidgetSkeleton config={config} />}>
				<LiFiWidget config={config} integrator="nextjs-example" />
			</LiFiWrapper>
		</div>
  );
}
