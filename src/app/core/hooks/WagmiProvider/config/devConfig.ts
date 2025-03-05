import { http } from "@wagmi/core";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, foundry, gnosis } from "wagmi/chains";
import { defineChain } from "viem";
import { getWallets } from "./wallets";
import { mockWallet } from "./mockWallet";

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

const config = getDefaultConfig({
  appName: "Breadchain Crowdstaking",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [gnosisChain, sepolia, foundryChain],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [...getWallets(), mockWallet(foundryChain)],
    },
  ],
  transports: {
    [foundry.id]: http("http://localhost:8545"), //not sure if needing to add the address
    [sepolia.id]: http(),
  },
});

export { config as devConfig };
