import type { ReactNode } from "react";
import { WagmiProvider, http } from "wagmi";
import { createConnector } from "@wagmi/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, Chain } from "wagmi/chains";
import { createWalletClient } from "viem";
import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { rainbowWallet, injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { CreateConnectorFn } from "@wagmi/core";
import { hashFn } from "@wagmi/core/query";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
    },
  },
});
const projectId = WALLET_CONNECT_PROJECT_ID;

const customConnector: CreateConnectorFn = () => {
  return {
    id: "custom-wallet",
    name: "Custom Wallet",
    type: "custom" as const,
    connect: async () => ({
      accounts: [devAccount],
      chainId: foundry.id,
    }),
    disconnect: async () => {
      console.log("Disconnected from custom wallet");
    },
    getAccounts: async () => {
      return [devAccount];
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
          address: devAccount,
          type: "json-rpc",
        },
        chain: foundry,
        transport: http("http://localhost:8545"),
      }),
    getProvider: async () => {
      return { provider: http("http://localhost:8545") };
    },
    onChainChanged: (chainId: string) => {
      console.log("Chain changed:", chainId);
    },
  };
};

// mock wallet 1
const devAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
// mock wallet 2
// const devAccount = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

export const customWallet = (): Wallet => ({
  id: "custom-dev-wallet",
  name: "Development Wallet",
  iconUrl: "https://my-image.xyz",
  iconBackground: "#0c2f78",
  hidden: () => false,
  createConnector: (
    walletDetails: WalletDetailsParams // Combine types
  ) =>
    createConnector((config) => ({
      ...customConnector(config),
      ...walletDetails,
    })),
});

const config = getDefaultConfig({
  appName: "Breadchain Crowdstaking",
  projectId: projectId,
  chains: [mainnet, sepolia, foundry],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, customWallet, injectedWallet],
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
