import {
  arbitrum,
  base,
  bsc,
  mainnet,
  sepolia,
  foundry,
  gnosis,
} from "wagmi/chains";
import { fallback, http, createConfig } from "wagmi";
import { defineChain } from "viem";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { createConfig as createPrivyConfig } from "@privy-io/wagmi";
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

const publicRpcUrls = [
	"https://rpc.gnosischain.com",
	"https://gnosis-rpc.publicnode.com",
];

const transportsRpcUrl = [
	process.env.NEXT_PUBLIC_ANKR_RPC_URL,
	process.env.NEXT_PUBLIC_DRPC_RPC_URL,
	...publicRpcUrls,
	process.env.NEXT_PUBLIC_GETBLOCK_RPC_URL,
	process.env.NEXT_PUBLIC_CHAINSTACK_RPC_URL,
	// I'm placing these as the last options. I noticed Quicknode is only used in development
	NEXT_PUBLIC_QUIKNODE_URL,
	// default back to public
	publicRpcUrls[0],
].map((rpc) => {
	if (!rpc) throw new Error(`Provide all env variables`);

	const isPublicRpc = publicRpcUrls.includes(rpc);

	return http(rpc, {
		timeout: isPublicRpc ? 7_000 : 10_000,
		retryCount: isPublicRpc ? 1 : 3,
		retryDelay: 500,
	});
});

const chains = [
  gnosisChain,
  ...sepoliaChain,
  mainnet,
  arbitrum,
  base,
  bsc,
] as const;

const transports = {
  [gnosis.id]: fallback(transportsRpcUrl),
  [sepolia.id]: httpProvider,
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
      wallets: getWallets(),
    },
  ],
  {
    appName: "Bread Coop Solidarity Fund",
    projectId: projectId,
  }
);

const iframeConfig = createConfig({
  connectors,
  chains,
  transports,
  ssr: true,
});

export { config as prodConfig, iframeConfig as prodIframeConfig };
