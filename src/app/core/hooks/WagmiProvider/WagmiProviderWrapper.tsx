import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
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
    accentColorForeground: "#0f0",
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

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const { config } = getConfig();

  return (
    <WagmiProvider reconnectOnMount={true} config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={theme}>
        {/* <RainbowKitProvider modalSize="compact" theme={customTheme}> */}
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
