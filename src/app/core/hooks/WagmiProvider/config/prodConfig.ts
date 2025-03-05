import { gnosis, sepolia } from "wagmi/chains";
import { http } from "wagmi";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { getWallets } from "./wallets";

const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID)
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not set!");

const NEXT_PUBLIC_QUIKNODE_URL = process.env.NEXT_PUBLIC_QUIKNODE_URL;
if (!NEXT_PUBLIC_QUIKNODE_URL)
  throw new Error("NEXT_PUBLIC_QUIKNODE_URL not set!");

const gnosisChain = defineChain({
  ...gnosis,
  iconUrl: "gnosis_icon.svg",
});

const httpProvider = http(
  process.env.NEXT_PUBLIC_TESTNET === "true"
    ? sepolia.rpcUrls.default.http[0]
    : NEXT_PUBLIC_QUIKNODE_URL
);

const sepoliaChain =
  process.env.NEXT_PUBLIC_TESTNET === "true" ? [sepolia] : [];

const projectId = NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const config = getDefaultConfig({
  appName: "Breadchain Crowdstaking",
  projectId: projectId,
  chains: [gnosisChain, ...sepoliaChain],
  wallets: [
    {
      groupName: "Recommended",
      wallets: getWallets(),
    },
  ],
  transports: {
    [gnosis.id]: http(),
    [sepolia.id]: httpProvider,
  },
});

export { config as prodConfig };
