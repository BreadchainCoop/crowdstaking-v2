"use client";
import { ReactNode } from "react";

import { WagmiProviderWrapper } from "@/app/core/hooks/WagmiProvider/WagmiProviderWrapper";
import { TokenBalancesProvider } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { ConnectedUserProvider } from "@/app/core/hooks/useConnectedUser";
import { TransactionsProvider } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { ToastProvider } from "@/app/core/context/ToastContext/ToastContext";

import { Features } from "@/app/layout";
import { useSentry } from "./useSentry";

import { ModalProvider } from "../context/ModalContext";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function AppProvider({
  children,
  features,
}: {
  children: ReactNode;
  features: Features;
}) {
  useSentry();

  return (
    <WagmiProviderWrapper>
      <ConnectedUserProvider features={features}>
        <TokenBalancesProvider>
          <ToastProvider>
            <TransactionsProvider>
              <ModalProvider>{children}</ModalProvider>
            </TransactionsProvider>
          </ToastProvider>
        </TokenBalancesProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </ConnectedUserProvider>
    </WagmiProviderWrapper>
  );
}
