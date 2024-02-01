"use client";
import "./app.css";
import Header from "@/app/core/components/Header";
import { RainbowProvider } from "@/app/core/hooks/WagmiProvider/WagmiProvider";
// import { TokenBalancesProvider } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { ConnectedUserProvider } from "@/app/core/hooks/useConnectedUser";
import { AnimatePresence } from "framer-motion";
import Footer from "@/app/core/components/Footer";
import { ReactNode } from "react";
import clsx from "clsx";
import { pressStart, redhat } from "@/app/core/components/Fonts";

import "@rainbow-me/rainbowkit/styles.css";
// import { TransactionsProvider } from "@/app/core/context/TransactionsContext/TransactionsContext";
// import { ToastProvider } from "@/app/core/context/ToastContext/ToastContext";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx("relative", pressStart.variable, redhat.variable)}>
        <RainbowProvider>
          <ConnectedUserProvider>
            {/* <TokenBalancesProvider> */}
            {/* <ToastProvider> */}
            {/* <TransactionsProvider> */}
            <Layout>{children}</Layout>
            {/* </TransactionsProvider> */}
            {/* </ToastProvider> */}
            {/* </TokenBalancesProvider> */}
          </ConnectedUserProvider>
        </RainbowProvider>
      </body>
    </html>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnimatePresence
        //  initial={false}
        mode="wait"
        // onExitComplete={() => null}
      ></AnimatePresence>
      <AnimatePresence
        //  initial={false}
        mode="wait"
        // onExitComplete={() => null}
      ></AnimatePresence>
      <div className="flex min-h-screen flex-col">
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
