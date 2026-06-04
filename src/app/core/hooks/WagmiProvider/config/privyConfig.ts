import { createConfig } from "@privy-io/wagmi";
import { fallback, http } from "wagmi";
import {
	arbitrum,
	base,
	bsc,
	foundry,
	gnosis,
	mainnet,
	sepolia,
} from "wagmi/chains";
import { defineChain } from "viem";

import { publicRpcUrls } from "./utils";

/**
 * Privy-managed wagmi config. Privy injects the connectors (the embedded wallet
 * + any linked external wallets), so we don't register RainbowKit/WalletConnect
 * connectors here. Gnosis is the primary chain (where BREAD lives); the other
 * chains are kept so the LiFi bridge can source funds from them.
 */
const gnosisChain = defineChain({ ...gnosis, iconUrl: "gnosis_icon.svg" });

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

const gnosisTransport = fallback(
	publicRpcUrls.map((rpc) => http(rpc, { timeout: 7_000, retryCount: 1 }))
);

export const privyWagmiConfig = createConfig({
	chains: [gnosisChain, mainnet, arbitrum, base, bsc, sepolia, foundryChain],
	transports: {
		[gnosis.id]: gnosisTransport,
		[mainnet.id]: http(),
		[arbitrum.id]: http(),
		[base.id]: http(),
		[bsc.id]: http(),
		[sepolia.id]: http(),
		[foundry.id]: http("http://localhost:8545"),
	},
});
