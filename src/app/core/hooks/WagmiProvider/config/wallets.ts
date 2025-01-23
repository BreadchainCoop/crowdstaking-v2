import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  frameWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  rabbyWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

export function getWallets(chains: Chain[], projectId: string) {
  return [
    injectedWallet({ chains, projectId, appName: "Breadchain Crowdstaking" }),
    metaMaskWallet({ chains, projectId }),
    walletConnectWallet({ chains, projectId }),
    frameWallet({ chains, projectId }),
    rabbyWallet({ chains }),
    coinbaseWallet({ chains, appName: "Breadchain Crowdstaking" }),
  ];
}
