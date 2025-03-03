import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, foundry, gnosis } from "wagmi/chains";
import { createConnector } from "@wagmi/core";
import { defineChain, createWalletClient } from "viem";
import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { CreateConnectorFn } from "@wagmi/core";
import { getWallets } from "./wallets";
// import { type Chain } from "viem";

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID)
  throw new Error("WALLET_CONNECT_PROJECT_ID not set!");

// export const foundry = {
//   id: 31_337,
//   name: "Foundry",
//   nativeCurrency: {
//     decimals: 18,
//     name: "Ether",
//     symbol: "ETH",
//   },
//   rpcUrls: {
//     default: {
//       http: ["http://localhost:8545"],
//     },
//     public: {
//       http: ["http://localhost:8545"],
//     },
//   },
//   blockExplorers: {
//     default: { name: "Local", url: "" },
//   },
//   testnet: true,
// } as const satisfies Chain;

const foundryChain = defineChain({
  ...foundry,
  id: 31337,
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 21_022_491,
    },
  },
});

const gnosisChain = defineChain({
  ...gnosis,
  iconUrl: "gnosis_icon.svg",
});

const devAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

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
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [gnosisChain, sepolia, foundryChain],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [...getWallets(), customWallet],
    },
  ],
  transports: {
    [foundry.id]: http("http://localhost:8545"), //not sure if needing to add the address
    [sepolia.id]: http(),
  },
});

export { config as devConfig };
