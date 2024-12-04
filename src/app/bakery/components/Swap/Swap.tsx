"use client";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { useChainModal } from "@rainbow-me/rainbowkit";

import { FromPanel } from "./FromPanel";
import SwapReverse from "../SwapReverse";
import ToPanel from "./ToPanel";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import Button from "@/app/core/components/Button";
import { AccountMenu } from "@/app/core/components/Header/AccountMenu";
import Bake from "./Bake";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import Burn from "./Burn";
import { Address } from "viem";
import { InsufficentBalance } from "./InsufficentBalance";
import { LiquidityBanner } from "../LiquidityBanner/LiquidityBanner";
import { TotalSupply } from "../TotalSupply";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";

export type TSwapMode = "BAKE" | "BURN";

export type TSwapState = {
  mode: TSwapMode;
  value: string;
};

const initialSwapState: TSwapState = {
  mode: "BAKE",
  value: "",
};

export function Swap() {
  const { user, isSafe } = useConnectedUser();
  const [connectedAccountAddress, setConnectedAccountAddress] =
    useState<null | Address>(null);
  const [swapState, setSwapState] = useState<TSwapState>(initialSwapState);

  if (user.status === "CONNECTED" && user.address !== connectedAccountAddress) {
    setConnectedAccountAddress(user.address);
    setSwapState((state) => ({ ...state, value: "" }));
  }

  const clearInputValue = useCallback(() => {
    setSwapState((state) => ({ ...state, value: "" }));
  }, [setSwapState]);

  const { openChainModal } = useChainModal();

  const { xDAI, BREAD } = useTokenBalances();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const sanitizedValue = sanitizeInputValue(value);
    setSwapState({
      ...swapState,
      value: sanitizedValue,
    });
  };

  const handleSwapReverse = () => {
    setSwapState((state) => ({
      mode: state.mode === "BAKE" ? "BURN" : "BAKE",
      value: "",
    }));
  };

  const handleBalanceClick = (value: string) => {
    setSwapState((state) => ({
      ...state,
      value:
        state.mode === "BAKE"
          ? parseFloat(value) - 0.01 > 0
            ? (parseFloat(value) - 0.01).toString()
            : "00.00"
          : parseFloat(value) === 0
          ? "00.00"
          : value,
    }));
  };

  return (
    <>
      {user.features.breadCounter && <TotalSupply />}
      <div className="w-full p-2 sm:p-4">
        <div className="w-full max-w-[30rem] m-auto relative rounded-xl swap-drop-shadow bg-breadgray-ultra-white dark:bg-breadgray-grey200 border-breadgray-burnt flex flex-col items-center">
          <div className="w-full drop-shadow-swap">
            <div className="w-full px-4 pt-2">
              <h2 className="text-[1.5rem] md:text-[1.9rem] font-medium">
                {swapState.mode === "BAKE" ? "Bake" : "Burn"}
              </h2>
            </div>
            <div className="relative w-full p-2 flex flex-col gap-1">
              <FromPanel
                inputValue={swapState.value}
                swapMode={swapState.mode}
                handleBalanceClick={handleBalanceClick}
                handleInputChange={handleInputChange}
                tokenBalance={swapState.mode === "BAKE" ? xDAI : BREAD}
              />
              <SwapReverse onClick={handleSwapReverse} />
              <ToPanel
                swapMode={swapState.mode}
                inputValue={swapState.value}
                tokenBalance={swapState.mode === "BURN" ? xDAI : BREAD}
              />
            </div>
          </div>
          <div className="p-2 pt-0 w-full">
            {(() => {
              switch (user.status) {
                case "LOADING":
                  return <ButtonShell />;
                case "NOT_CONNECTED":
                  return (
                    <AccountMenu fullWidth={true} size="large">
                      Connect
                    </AccountMenu>
                  );
                case "UNSUPPORTED_CHAIN":
                  return (
                    <Button
                      fullWidth={true}
                      size="large"
                      variant="danger"
                      onClick={() => openChainModal?.()}
                    >
                      Change network
                    </Button>
                  );
                case "CONNECTED":
                  const sourceToken = swapState.mode === "BAKE" ? xDAI : BREAD;

                  if (!sourceToken) return <ButtonShell />;
                  if (sourceToken.status !== "SUCCESS") return <ButtonShell />;

                  const balanceIsSufficent =
                    parseFloat(swapState.value || "0") <=
                    parseFloat(sourceToken.value);

                  if (balanceIsSufficent)
                    return swapState.mode === "BAKE" ? (
                      <Bake
                        user={user}
                        clearInputValue={clearInputValue}
                        inputValue={swapState.value}
                        isSafe={isSafe}
                      />
                    ) : (
                      <Burn
                        user={user}
                        clearInputValue={clearInputValue}
                        inputValue={swapState.value}
                        isSafe={isSafe}
                      />
                    );

                  return <InsufficentBalance />;
              }
            })()}
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <LiquidityBanner />
      </div>
    </>
  );
}

function ButtonShell() {
  return (
    <div className="h-16 bg-breadgray-ultra-white dark:bg-neutral-800 rounded-xl" />
  );
}
export default Swap;
