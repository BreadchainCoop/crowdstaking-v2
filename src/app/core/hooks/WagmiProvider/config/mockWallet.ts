import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { createConnector, CreateConnectorFn } from "@wagmi/core";
import { type Chain, createWalletClient } from "viem";
import { http } from "@wagmi/core";

const devAccount = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

export const mockWallet = (chain: Chain) => {
  const customConnector: CreateConnectorFn = () => {
    return {
      id: "custom-wallet",
      name: "Custom Wallet",
      type: "custom" as const,
      connect: async () => ({
        accounts: [devAccount],
        chainId: chain.id,
      }),
      disconnect: async () => {
        console.log("Disconnected from custom wallet");
      },
      getAccounts: async () => {
        return [devAccount];
      },
      getChainId: async () => {
        return chain.id;
      },
      isAuthorized: async () => {
        return true;
      },
      onAccountsChanged: (accounts: string[]) => {
        console.log("Accounts changed:", accounts);
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
      getWalletClient: async () =>
        createWalletClient({
          account: {
            address: devAccount,
            type: "json-rpc",
          },
          chain: chain,
          transport: http("http://localhost:8545"),
        }),
      getProvider: async () => {
        return { provider: http("http://localhost:8545") };
      },
      onChainChanged: (chainId: string) => {
        console.log("Chain changed:", chainId);
      },
    };
  };

  const customWallet = (): Wallet => ({
    id: "custom-dev-wallet",
    name: "Development Wallet",
    iconUrl: "https://my-image.xyz",
    iconBackground: "#0c2f78",
    hidden: () => false,
    createConnector: (
      walletDetails: WalletDetailsParams // Combine types
    ) =>
      createConnector((config) => ({
        ...customConnector(config),
        ...walletDetails,
      })),
  });

  return customWallet;
};
