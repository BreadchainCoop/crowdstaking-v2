import type { ReactNode } from "react";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { WagmiProvider as PlainWagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, Theme, darkTheme } from "@rainbow-me/rainbowkit";
import { hashFn } from "@wagmi/core/query";
import { getConfig } from "./config/getConfig";

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID)
  throw new Error("WALLET_CONNECT_PROJECT_ID not set!");

const baseTheme = darkTheme({
  accentColor: "#EA5817",
  accentColorForeground: "yellow",
  borderRadius: "none",
  fontStack: "system",
  overlayBlur: "small",
});

const customTheme: Theme = {
  // @ts-expect-error Correct
  colors: {
    closeButton: "#EA5817",
    accentColor: "#EA5817",
    connectButtonText: "#EA5817",
    modalTextSecondary: "#EA5817",
    modalBackground: "#FDFAF3",
    modalBorder: "#eae2d6",
    modalText: "#171717",
    accentColorForeground: "#171717",
  },
  fonts: {
    body: "var(--font-breadBody)",
  },
}

const theme: Theme = {
  ...baseTheme,
  ...customTheme,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
    },
  },
});

// @privy-io/wagmi's WagmiProvider unconditionally clears wagmi's connector
// registry whenever Privy has no active wallet, which breaks the "safe"
// connector's auto-connect (a Safe{Wallet} session never goes through
// Privy's login flow -- it's always iframed). Detect that case up front and
// fall back to a plain wagmi provider with our own connector list there.
function isRunningInIframe() {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin access to window.top throws -- definitely framed.
    return true;
  }
}

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const { config, iframeConfig } = getConfig();
  const inIframe = isRunningInIframe();

  const inner = (
    <RainbowKitProvider modalSize="compact" theme={theme}>
    {/* <RainbowKitProvider modalSize="compact" theme={customTheme}> */}
      {children}
    </RainbowKitProvider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      {inIframe ? (
        <PlainWagmiProvider reconnectOnMount={true} config={iframeConfig}>
          {inner}
        </PlainWagmiProvider>
      ) : (
        <PrivyWagmiProvider reconnectOnMount={true} config={config}>
          {inner}
        </PrivyWagmiProvider>
      )}
    </QueryClientProvider>
  );
}
