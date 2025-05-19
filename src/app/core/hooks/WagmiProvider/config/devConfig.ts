import { http } from "@wagmi/core";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, foundry, gnosis } from "wagmi/chains";
import { defineChain } from "viem";
import { getWallets } from "./wallets";
import { mockWallet } from "@/app/core/hooks/WagmiProvider/config/mockWallet";

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID)
  throw new Error("WALLET_CONNECT_PROJECT_ID not set!");

const devAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const devAccount2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

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
  chains: [foundryChain, sepolia, gnosisChain],
  wallets: [
    {
      groupName: "Recommended",
      wallets: [
        ...getWallets(),
        mockWallet(foundryChain, devAccount, "Mock Wallet 1"),
        mockWallet(foundryChain, devAccount2, "Mock Wallet 2"),
      ],
    },
  ],
  transports: {
    [foundry.id]: http("http://localhost:8545"), //not sure if needing to add the address
    [sepolia.id]: http(),
  },
});

export { config as devConfig };
