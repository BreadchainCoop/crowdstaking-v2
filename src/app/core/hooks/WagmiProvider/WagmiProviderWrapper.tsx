import { useRef, type ReactNode } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import type { Config } from 'wagmi';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { hashFn } from "@wagmi/core/query";
import { getConfig } from "./config/getConfig";
import { injected } from '@wagmi/connectors'
import { useAvailableChains } from "@lifi/widget";
import { useSyncWagmiConfig } from '@lifi/wallet-management';
import { gnosis, mainnet } from "viem/chains";
import { createClient, http } from "viem";

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID)
  throw new Error("WALLET_CONNECT_PROJECT_ID not set!");

const baseTheme = darkTheme({
  accentColor: "#E873D3",
  accentColorForeground: "#2E2E2E",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    modalBackground: "#242424",
  },
  fonts: {
    body: "var(--font-redhat)",
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
    },
  },
});

const connectors = [injected()];

function WagmiConfigManager({ children }: { children: ReactNode }) {
  const { config } = getConfig();
  const { chains } = useAvailableChains();
  const wagmi = useRef<Config>();

  if (!wagmi.current) {
    wagmi.current = config as Config;
  }

  useSyncWagmiConfig(wagmi.current, connectors, chains);

  return (
    <WagmiProvider reconnectOnMount config={wagmi.current}>
      <RainbowKitProvider modalSize="compact" theme={theme} initialChain={gnosis}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfigManager>
        {children}
      </WagmiConfigManager>
    </QueryClientProvider>
  );
}
