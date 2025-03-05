import { http } from "@wagmi/core";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat } from "wagmi/chains";
import { getWallets } from "./wallets";
import { defineChain } from "viem";

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID)
  throw new Error("WALLET_CONNECT_PROJECT_ID not set!");

const hardhatChain = defineChain({
  ...hardhat,
  id: 3133,
});

const config = getDefaultConfig({
  appName: "Breadchain Crowdstaking",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [hardhatChain],
  wallets: [
    {
      groupName: "Recommended",
      wallets: getWallets(),
    },
  ],
  transports: {
    [hardhat.id]: http("http://localhost:8545"), //not sure if needing to add the address
  },
});

export { config };
