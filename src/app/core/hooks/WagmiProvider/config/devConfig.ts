import { http } from "@wagmi/core";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { createConfig as createPrivyConfig } from "@privy-io/wagmi";
import { createConfig } from "wagmi";
import {
  arbitrum,
  base,
  bsc,
  mainnet,
  sepolia,
  foundry,
  gnosis,
} from "wagmi/chains";
import { defineChain } from "viem";
import { getWallets } from "./wallets";
import { mockWallet } from "@/app/core/hooks/WagmiProvider/config/mockWallet";

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID)
  throw new Error("WALLET_CONNECT_PROJECT_ID not set!");

const devAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const devAccount2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

export const foundryChain = defineChain({
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

const chains = [
  foundryChain,
  sepolia,
  gnosisChain,
  mainnet,
  arbitrum,
  base,
  bsc,
] as const;

const transports = {
  [foundry.id]: http("http://localhost:8545"), //not sure if needing to add the address
  [gnosis.id]: http(),
  [sepolia.id]: http(),
  [mainnet.id]: http(),
  [arbitrum.id]: http(),
  [base.id]: http(),
  [bsc.id]: http(),
};

// Outside an iframe: Privy owns wallet-connector management dynamically
// (its own login modal, embedded wallets, WalletConnect, etc -- see
// privy.tsx's walletList). @privy-io/wagmi's createConfig silently drops
// any custom `connectors` we'd pass here, so don't bother passing any.
const config = createPrivyConfig({
  chains,
  transports,
  ssr: true,
});

// Inside an iframe (eg. a Safe{Wallet} app): Privy's wagmi bridge
// unconditionally clears the connector registry whenever Privy has no
// active wallet, which breaks the "safe" connector's auto-connect -- a Safe
// session never goes through Privy's login flow. Keep a plain wagmi config
// with our own RainbowKit connector list for that case.
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        ...getWallets(),
        mockWallet(foundryChain, devAccount, "Mock Wallet 1"),
        mockWallet(foundryChain, devAccount2, "Mock Wallet 2"),
      ],
    },
  ],
  {
    appName: "Bread Coop Solidarity Fund",
    projectId: WALLET_CONNECT_PROJECT_ID,
  }
);

const iframeConfig = createConfig({
  connectors,
  chains,
  transports,
  ssr: true,
});

export { config as devConfig, iframeConfig as devIframeConfig };
