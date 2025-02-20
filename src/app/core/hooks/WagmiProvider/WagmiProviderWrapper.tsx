import type { ReactNode } from "react";
import { WagmiProvider, http, Connector } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, Chain } from "wagmi/chains";
import { createWalletClient, custom } from "viem";
import { Wallet, getWalletConnectConnector } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

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

const foundry: Chain = {
  id: 31_337,
  name: "Foundry",
  network: "foundry",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"],
    },
    public: {
      http: ["http://localhost:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Local", url: "" },
  },
  testnet: true,
};

const queryClient = new QueryClient();
const projectId = WALLET_CONNECT_PROJECT_ID;

export interface MyWalletOptions {
  projectId: string;
}
export const rainbow = ({ projectId }: MyWalletOptions): Wallet => ({
  id: "custom-wallet",
  name: "Custom Wallet",
  iconUrl: "https://my-image.xyz",
  iconBackground: "#0c2f78",
  createConnector: () => (config) => ({
    connect: async () => ({
      accounts: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
      chainId: foundry.id,
    }),
    disconnect: async () => {
      console.log("Disconnected from custom wallet");
    },
    getAccounts: async () => {
      return ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];
    },
    getChainId: async () => {
      return foundry.id;
    },
    isAuthorized: async () => {
      return true;
    },
    onAccountsChanged: (accounts: string[]) => {
      console.log("Accounts changed:", accounts);
    },
    onDisconnect: () => {
      console.log("Disconnected");
    },
    getWalletClient: async () =>
      createWalletClient({
        account: {
          address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          type: "json-rpc",
        },
        chain: foundry,
        transport: http("http://localhost:8545"),
      }),
    id: "custom-wallet",
    name: "Custom Wallet",
    type: "custom" as const,
    getProvider: async () => {
      return { provider: http("http://localhost:8545") };
    },
    onChainChanged: (chainId: string) => {
      console.log("Chain changed:", chainId);
    },
  }),
});

const config = getDefaultConfig({
  appName: "Breadchain Crowdstaking",
  projectId: projectId,
  chains: [foundry, mainnet, sepolia],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, walletConnectWallet, rainbow],
    },
  ],
  transports: {
    [foundry.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
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
