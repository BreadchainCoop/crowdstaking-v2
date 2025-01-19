import { configureChains, createConfig, sepolia } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { foundry, gnosis } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

import { publicProvider } from "wagmi/providers/public";

import { getWallets } from "./wallets";
import { mockWallet } from "./mockWallet";
import { SafeConnector } from "wagmi/connectors/safe";

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!WALLET_CONNECT_PROJECT_ID)
  throw new Error("WALLET_CONNECT_PROJECT_ID not set!");

const chainsConfig = configureChains(
  [
    {
      ...foundry,
      id: 31337,
      contracts: {
        multicall3: {
          address: "0xcA11bde05977b3631167028862bE2a173976CA11",
          blockCreated: 21_022_491,
        },
      },
    },
    {
      ...gnosis,
      iconUrl: "gnosis_icon.svg",
    },
    sepolia,
  ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: () => ({
        http: "http://localhost:8545",
        webSocket: "ws://localhost:8545",
      }),
    }),
  ]
);

export const { chains } = chainsConfig;

const { publicClient } = chainsConfig;

const projectId = WALLET_CONNECT_PROJECT_ID;

const connectors = connectorsForWallets([
  {
    groupName: "Wallets",
    wallets: [
      ...getWallets(chains, projectId),
      mockWallet(
        chains,
        "mock2",
        "Mock Wallet 2",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
      ),
      mockWallet(
        chains,
        "mock1",
        "Mock Wallet 1",
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
      ),
    ],
  },
]);

const config = createConfig({
  connectors: [
    ...connectors(),
    new SafeConnector({
      chains,
      options: {
        allowedDomains: [/app.safe.global$/],
        debug: false,
      },
    }),
  ],
  publicClient,
});

export { chains as devChains, config as devConfig };
