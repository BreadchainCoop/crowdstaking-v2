import {
	frameWallet,
	injectedWallet,
	metaMaskWallet,
	walletConnectWallet,
	rabbyWallet,
	coinbaseWallet,
	safeWallet,
} from "@rainbow-me/rainbowkit/wallets";

const WALLET_CONNECT_PROJECT_ID =
	process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

// https://github.com/rainbow-me/rainbowkit/issues/2476#issuecomment-3117608183
export function getWallets() {
	const wallets = [
		injectedWallet,
		// metaMaskWallet,
		// walletConnectWallet,
		frameWallet,
		rabbyWallet,
		coinbaseWallet,
		safeWallet,
	];

	if (typeof indexedDB !== "undefined") {
		wallets.unshift(
			// @ts-expect-error Correct
			metaMaskWallet,
			() => walletConnectWallet({ projectId: WALLET_CONNECT_PROJECT_ID! })
		);
	}

	return wallets;
}
