"use client";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";

import {
  TUserConnected,
  useConnectedUser,
} from "@/app/core/hooks/useConnectedUser";
import { getChain } from "@/chainConfig";
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

  const chainConfig = getChain(user.chain.id);

  const { data, status } = useRefetchOnBlockChangeForUser(
    user.address,
    chainConfig.BUTTERED_BREAD.address,
    BUTTERED_BREAD_ABI,
    "accountToLPBalance",
    [user.address, chainConfig.BUTTER.address]
  );

  useEffect(() => {
    if (status === "success" && data !== undefined) {
      setVotingPowerState({
        butter: {
          status: "success",
          value: data as bigint,
        },
      });
    }
  }, [status, data]);

  return (
    <VaultTokenBalanceContext.Provider value={votingPowerState}>
      {children}
    </VaultTokenBalanceContext.Provider>
  );
}

export { VaultTokenBalanceProvider, useVaultTokenBalance };
