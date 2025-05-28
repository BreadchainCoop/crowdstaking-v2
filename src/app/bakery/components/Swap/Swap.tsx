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
import { LiquidityBanner } from "../Banners/LiquidityBanner";
import { BridgeBanner } from "../Banners/BridgeBanner";
import { TotalSupply } from "../TotalSupply";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { clsx } from "clsx";
// import { Bridge } from "./Bridge";

export type TSwapMode = "BAKE" | "BURN" | "BRIDGE";

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
    const modes: TSwapMode[] = ["BAKE", "BURN", "BRIDGE"];
    const currentIndex = modes.indexOf(swapState.mode);
    const nextIndex = (currentIndex + 1) % modes.length;

    setSwapState((state) => ({
      mode: modes[nextIndex],
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

  const renderModeButton = (mode: TSwapMode) => {
    const isActive = swapState.mode === mode;
    return (
      <h3
        onClick={isActive ? undefined : handleSwapReverse}
        className={clsx(
          "text-2xl inline font-medium py-0 me-2 px-4 rounded-[10px]",
          isActive
            ? "bg-breadpink-700/10 dark:bg-none text-breadpink-500 dark:text-breadpink-shaded border border-breadpink-shaded"
            : "hover:cursor-pointer hover:text-breadpink-500 hover:bg-breadpink-700/10 hover:dark:text-breadpink-shaded"
        )}
      >
        <span>{mode.charAt(0) + mode.slice(1).toLowerCase()} sdsd</span>
      </h3>
    );
  };

  return (
    <>
      {user.features.breadCounter && <TotalSupply />}
      <div className="w-full p-2 sm:p-4">
        <div className="w-full max-w-[30rem] p-3 m-auto relative rounded-xl swap-drop-shadow bg-breadgray-ultra-white dark:bg-breadgray-grey200 border-breadgray-burnt flex flex-col items-center">
          <div className="w-full drop-shadow-swap">
            <div className="w-full">
              {["BAKE", "BURN", "BRIDGE"].map((mode) => (
                <div key={mode}>{renderModeButton(mode as TSwapMode)}</div>
              ))}
            </div>
            <div className="relative w-full my-2 flex flex-col gap-1">
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
          <div className="w-full">
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

                  if (balanceIsSufficent) {
                    switch (swapState.mode) {
                      case "BAKE":
                        return (
                          <Bake
                            user={user}
                            clearInputValue={clearInputValue}
                            inputValue={swapState.value}
                            isSafe={isSafe}
                          />
                        );
                      case "BURN":
                        return (
                          <Burn
                            user={user}
                            clearInputValue={clearInputValue}
                            inputValue={swapState.value}
                            isSafe={isSafe}
                          />
                        );
                      case "BRIDGE":
                        return "asd";
                    }
                  }

                  return <InsufficentBalance />;
              }
            })()}
          </div>
        </div>
      </div>
      <div className="pb-4 m-auto max-w-[30rem]">
        <BridgeBanner />
      </div>
      <div className="pb-4 m-auto max-w-[30rem]">
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
