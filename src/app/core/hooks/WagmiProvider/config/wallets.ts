import {
  frameWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  rabbyWallet,
  coinbaseWallet,
  safeWallet,
} from "@rainbow-me/rainbowkit/wallets";

export function getWallets() {
  return [
    injectedWallet,
    metaMaskWallet,
    walletConnectWallet,
    frameWallet,
    rabbyWallet,
    coinbaseWallet,
    safeWallet,
  ];
}
