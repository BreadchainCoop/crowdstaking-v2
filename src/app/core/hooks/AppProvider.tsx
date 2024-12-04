"use client";
import { ReactNode } from "react";

import { WagmiProvider } from "@/app/core/hooks/WagmiProvider/WagmiProvider";
import { TokenBalancesProvider } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { ConnectedUserProvider } from "@/app/core/hooks/useConnectedUser";
import { TransactionsProvider } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { ToastProvider } from "@/app/core/context/ToastContext/ToastContext";

import { Features } from "@/app/layout";
import { useSentry } from "./useSentry";

import { ModalProvider } from "../context/ModalContext";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

export function AppProvider({
  children,
  features,
}: {
  children: ReactNode;
  features: Features;
}) {
  useSentry();

  return (
    <WagmiProvider>
      <ConnectedUserProvider features={features}>
        <QueryClientProvider client={queryClient}>
          <TokenBalancesProvider>
            <ToastProvider>
              <TransactionsProvider>
                <ModalProvider>{children}</ModalProvider>
              </TransactionsProvider>
            </ToastProvider>
          </TokenBalancesProvider>
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </ConnectedUserProvider>
    </WagmiProvider>
  );
}
