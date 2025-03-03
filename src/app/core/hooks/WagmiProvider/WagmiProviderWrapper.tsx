import type { ReactNode } from "react";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, Chain } from "wagmi/chains";
import { rainbowWallet, injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { hashFn } from "@wagmi/core/query";
import { getConfig } from "./config/getConfig";

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
const projectId = WALLET_CONNECT_PROJECT_ID;

// mock wallet 1
// const devAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
// mock wallet 2
// const devAccount = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

// const config = getDefaultConfig({
//   appName: "Breadchain Crowdstaking",
//   projectId: projectId,
//   chains: [mainnet, sepolia, foundry],
//   wallets: [
//     {
//       groupName: "Recommended",
//       wallets: [rainbowWallet, customWallet, injectedWallet],
//     },
//   ],
//   transports: {
//     [foundry.id]: http(),
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
// });

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const { config } = getConfig();

  return (
    <WagmiProvider reconnectOnMount={true} config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={theme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
