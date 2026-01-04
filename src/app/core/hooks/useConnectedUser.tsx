"use client";

import { type ReactNode, createContext, useContext, useMemo } from "react";
import { useAccount } from "wagmi";
import { type Chain } from "viem";

import {
  getChain,
  isChainSupported,
  type ChainConfiguration,
} from "@/chainConfig";
import { useAutoConnect } from "./useAutoConnect";
import { Features } from "@/app/layout";
import { Hex } from "viem";

export type TUserLoading = { status: "LOADING"; features: Features };
export type TUserNotConnected = { status: "NOT_CONNECTED"; features: Features };
export type TUserConnected = {
  status: "CONNECTED";
  address: Hex;
  config: ChainConfiguration;
  chain: Chain;
  features: Features;
};
export type TUnsupportedChain = {
  status: "UNSUPPORTED_CHAIN";
  address: Hex;
  config: ChainConfiguration;
  chain: Chain | undefined;
  features: Features;
};

export type TConnectedUserState =
  | TUserLoading
  | TUserNotConnected
  | TUserConnected
  | TUnsupportedChain;

const ConnectedUserContext = createContext<{
  user: TConnectedUserState;
  isSafe: boolean;
}>({
  user: {
    status: "LOADING",
    features: {
      governancePage: false,
      breadCounter: false,
      votingHistory: false,
      recastVote: false,
      lpVaults: false,
      bridge: false,
    },
  },
  isSafe: false,
});

interface IConnectedUserProviderProps {
  children: ReactNode;
  features: Features;
}

function ConnectedUserProvider({
  children,
  features,
}: IConnectedUserProviderProps) {
  const {
    isConnected,
    connector: activeConnector,
    address: accountAddress,
    status,
    chain: activeChain,
  } = useAccount();

  console.log("__ ACCOUNT HOOK __", {
    isConnected,
    connector: activeConnector,
    address: accountAddress,
    status,
    chain: activeChain,
  });

  const { isSafe } = useAutoConnect(activeConnector);

  const user = useMemo<TConnectedUserState>(() => {
    if (status === "connecting") {
      return { status: "LOADING", features };
    }

    if (status === "disconnected" || !isConnected || !accountAddress) {
      return { status: "NOT_CONNECTED", features };
    }

    if (!activeChain) {
      const defaultConfig = getChain("DEFAULT");
      return {
        status: "UNSUPPORTED_CHAIN",
        address: accountAddress,
        config: defaultConfig,
        chain: undefined,
        features,
      };
    }

    const chainSupported = isChainSupported(activeChain.id);

    const config = chainSupported
      ? getChain(activeChain.id)
      : getChain("DEFAULT");

    return {
      status: chainSupported ? "CONNECTED" : "UNSUPPORTED_CHAIN",
      address: accountAddress,
      config,
      chain: activeChain,
      features,
    };
  }, [isConnected, accountAddress, activeChain, status, features]);

  const value = useMemo(() => ({ user, isSafe }), [user, isSafe]);

  console.log("__ USER STATE __", user);
  console.log("__ VALUE USER STATE __", value.user);

  return (
    <ConnectedUserContext.Provider value={value}>
      {children}
    </ConnectedUserContext.Provider>
  );
}

const useConnectedUser = () => {
  const context = useContext(ConnectedUserContext);
  if (context === undefined) {
    throw new Error(
      "useConnectedUser must be used within a ConnectedUserProvider"
    );
  }
  return context;
};

export { ConnectedUserProvider, useConnectedUser };
