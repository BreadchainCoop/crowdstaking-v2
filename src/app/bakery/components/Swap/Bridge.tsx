"use client";

import type { Route, RouteExecutionUpdate, WidgetConfig } from "@lifi/widget";
import {
  LiFiWidget,
  useWidgetEvents,
  WidgetEvent,
  WidgetSkeleton,
} from "@lifi/widget";
import { LiFiWrapper } from "./LiFiWrapper";
import { useEffect } from "react";
import { useModal } from "@/app/core/context/ModalContext";
import { useToast } from "@/app/core/context/ToastContext/ToastContext";

export function Bridge() {
  /*
  From LiFi Docs (https://docs.li.fi/widget/widget-events#list-of-events)
  To minimize unnecessary re-renders and prevent potential glitches in the main Widget component, please integrate the useWidgetEvents hook outside of the component where the main LiFiWidget is integrated.
  */
  const widgetEvents = useWidgetEvents();
  const { setModal } = useModal();
  const { toastDispatch } = useToast();

  useEffect(() => {
    const onRouteExecutionCompleted = (route: Route) => {
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

  return <LiFiMainWrapper />;
}

function LiFiMainWrapper() {
  const config = {
		appearance: "system",
		chains: {
			allow: [1, 100, 42161, 8453, 56],
		},
		// initialize to xDai on Gnosis chain
		toToken: "0x0000000000000000000000000000000000000000",
		toChain: 100,
		theme: {
			container: {
				boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
				borderRadius: "0px",
				width: "100%",
				maxWidth: "none",
			},
		},
		disabledUI: ["toToken"],
  } as Partial<WidgetConfig>;

  return (
		<div>
			<LiFiWrapper fallback={<WidgetSkeleton config={config} />}>
				<LiFiWidget config={config} integrator="nextjs-example" />
			</LiFiWrapper>
		</div>
  );
}
