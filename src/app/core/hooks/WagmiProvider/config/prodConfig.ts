import {
  arbitrum,
  base,
  bsc,
  mainnet,
  sepolia,
  foundry,
  gnosis,
} from "wagmi/chains";
import { fallback, http } from "wagmi";
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

const config = getDefaultConfig({
  appName: "Bread Coop Solidarity Fund",
  projectId: projectId,
  chains: [gnosisChain, ...sepoliaChain, mainnet, arbitrum, base, bsc],
  wallets: [
    {
      groupName: "Recommended",
      wallets: getWallets(),
    },
  ],
  transports: {
    [gnosis.id]: fallback(transportsRpcUrl),
    [sepolia.id]: httpProvider,
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
  },
});

export { config as prodConfig };
