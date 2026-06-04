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
import { PrivyProvider } from "@privy-io/react-auth";
import { gnosis } from "viem/chains";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

export function AppProvider({
  children,
  features,
}: {
  children: ReactNode;
  features: Features;
}) {
  useSentry();

  const inner = (
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

  if (!PRIVY_APP_ID) return inner;

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      clientId={PRIVY_CLIENT_ID}
      config={{
        appearance: { theme: "light" },
        // Gnosis-first: the Solidarity Fund lives on Gnosis (xDAI -> BREAD).
        defaultChain: gnosis,
        supportedChains: [gnosis],
        // Give every user a Privy embedded wallet so the deposit flow can
        // auto-bake xDAI into BREAD with sponsored, UI-less transactions.
        embeddedWallets: {
          ethereum: { createOnLogin: "all-users" },
        },
      }}
    >
      {inner}
    </PrivyProvider>
  );
}
