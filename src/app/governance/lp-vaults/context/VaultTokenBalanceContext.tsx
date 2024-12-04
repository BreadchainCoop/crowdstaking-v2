"use client";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useContractRead } from "wagmi";

import {
  TUserConnected,
  useConnectedUser,
} from "@/app/core/hooks/useConnectedUser";
import { getConfig } from "@/chainConfig";
import { BUTTERED_BREAD_ABI } from "@/abi";

type VaultTokenBalanceLoading = {
  status: "loading";
};

type VaultTokenBalanceError = {
  status: "error";
};

type VaultTokenBalanceSuccess = {
  status: "success";
  value: bigint;
};

type VaultTokenBalanceState = null | {
  butter:
    | VaultTokenBalanceLoading
    | VaultTokenBalanceSuccess
    | VaultTokenBalanceError;
};

const VaultTokenBalanceContext = createContext<VaultTokenBalanceState>(null);

function VaultTokenBalanceProvider({ children }: { children: ReactNode }) {
  const { user } = useConnectedUser();

  if (user.status === "CONNECTED") {
    return <ProviderWithUser user={user}>{children}</ProviderWithUser>;
  }

  return (
    <VaultTokenBalanceContext.Provider value={null}>
      {children}
    </VaultTokenBalanceContext.Provider>
  );
}

function useVaultTokenBalance() {
  const context = useContext(VaultTokenBalanceContext);
  if (context === undefined) {
    throw new Error(
      "useVaultTokenBalance must be used within a VaultTokenBalanceProvider"
    );
  }
  return context;
}

function ProviderWithUser({
  user,

  children,
}: {
  user: TUserConnected;
  children: ReactNode;
}) {
  const [votingPowerState, setVotingPowerState] =
    useState<VaultTokenBalanceState>({
      butter: { status: "loading" },
    });

  const config = getConfig(user.chain.id);

  const { data, status, error } = useContractRead({
    address: config.BUTTERED_BREAD.address,
    abi: BUTTERED_BREAD_ABI,
    functionName: "accountToLPBalance",
    args: [user.address, config.BUTTER.address],
    watch: true,
  });

  useEffect(() => {
    if (status === "success" && data !== undefined) {
      setVotingPowerState({
        butter: {
          status: "success",
          value: data,
        },
      });
    }
  }, [status, data, error]);

  return (
    <VaultTokenBalanceContext.Provider value={votingPowerState}>
      {children}
    </VaultTokenBalanceContext.Provider>
  );
}

export { VaultTokenBalanceProvider, useVaultTokenBalance };
