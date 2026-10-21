"use client";
import { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

import { WagmiProviderWrapper } from "@/app/core/hooks/WagmiProvider/WagmiProviderWrapper";
import { TokenBalancesProvider } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { ConnectedUserProvider } from "@/app/core/hooks/useConnectedUser";
import { TransactionsProvider } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { ToastProvider } from "@/app/core/context/ToastContext/ToastContext";

import { Features } from "@/app/layout";
import { useSentry } from "./useSentry";

import { ModalProvider } from "../context/ModalContext";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PrivyProvider from "@/app/components/providers/privy";

export function AppProvider({
  children,
  features,
}: {
  children: ReactNode;
  features: Features;
}) {
  useSentry();

  return (
    <PrivyProvider>
      <WagmiProviderWrapper>
        <ConnectedUserProvider features={features}>
          <TokenBalancesProvider>
            <ToastProvider>
              <TransactionsProvider>
                <ModalProvider>
                  {/* Loads framer-motion's animation features once for every `m.*` component. */}
                  <LazyMotion features={domAnimation}>{children}</LazyMotion>
                </ModalProvider>
              </TransactionsProvider>
            </ToastProvider>
          </TokenBalancesProvider>
          <ReactQueryDevtools initialIsOpen={true} />
        </ConnectedUserProvider>
      </WagmiProviderWrapper>
    </PrivyProvider>
  );
}
