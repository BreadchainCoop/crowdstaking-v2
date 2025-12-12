import {
  frameWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  rabbyWallet,
  coinbaseWallet,
  safeWallet,
} from "@rainbow-me/rainbowkit/wallets";

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
		// @ts-expect-error Correct
		wallets.unshift(metaMaskWallet, walletConnectWallet);
	}

	return wallets;
}
