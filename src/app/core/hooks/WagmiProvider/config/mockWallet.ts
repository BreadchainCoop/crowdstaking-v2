import { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";
import { createConnector, CreateConnectorFn } from "@wagmi/core";
import { type Chain, createWalletClient, Hex } from "viem";
import { http } from "@wagmi/core";

export const mockWallet = (chain: Chain, devAccount: Hex, name: string) => {
  const customConnector: CreateConnectorFn = () => {
    return {
      id: name.replace(/\s+/g, "-").toLowerCase(),
      name: name,
      type: "custom" as const,
      connect: async () => {
        if (typeof window !== "undefined") {
          localStorage.setItem("devWalletConnected", devAccount);
        }
        return {
          accounts: [devAccount],
          chainId: chain.id,
        };
      },
      disconnect: async () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("devWalletConnected");
        }
        console.log("Disconnected from custom wallet");
      },
      getAccounts: async () => {
        return [devAccount];
      },
      getChainId: async () => {
        return chain.id;
      },
      isAuthorized: async () => {
        if (typeof window !== "undefined") {
          return localStorage.getItem("devWalletConnected") === devAccount;
        }
        return false;
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
    id: name.replace(/\s+/g, "-").toLowerCase(),
    name: name,
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
