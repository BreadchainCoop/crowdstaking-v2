import { useEffect, useState } from "react";
import { formatUnits, Hex, parseEther } from "viem";
import {
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";

import useDebounce from "@/app/bakery/hooks/useDebounce";
import Button from "@/app/core/components/Button";
import { useModal } from "@/app/core/context/ModalContext";

import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { SelectTransaction } from "./SelectTransaction";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { WXDAIIcon, BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { useTokenBalance } from "@/app/core/hooks/useTokenBalance";
import { lpTokenMeta } from "@/app/lpTokenMeta";
import { GradientBorder } from "@/app/core/components/GradientBorder";
import { WXDaiBreadIcon } from "@/app/core/components/Modal/LPVaultTransactionModal/VPRate";
import { MaxButton } from "@/app/core/components/MaxButton";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { formatBalance } from "@/app/core/util/formatter";
import { useVaultTokenBalance } from "../context/VaultTokenBalanceContext";
import { AccountMenu } from "@/app/core/components/Header/AccountMenu";

export type TransactionType = "LOCK" | "UNLOCK";

export function VaultPanel({ tokenAddress }: { tokenAddress: Hex }) {
  const [inputValue, setInputValue] = useState("");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("LOCK");
  const { user } = useConnectedUser();
  const { transactionsState } = useTransactions();

  const lpTokenBalance = useTokenBalance(user, tokenAddress);
  const vaultTokenBalance = useVaultTokenBalance();

  useEffect(() => {
    const lpVaultTransaction = transactionsState.submitted.filter(
      (tx) => tx.data.type === "LP_VAULT_DEPOSIT" && tx.status === "CONFIRMED"
    );
    if (lpVaultTransaction.length > 0) setInputValue("");
  }, [transactionsState, setInputValue]);

  const debouncedValue = useDebounce(inputValue, 500);

  const parsedValue = parseEther(
    debouncedValue === "." ? "0" : debouncedValue || "0"
  );

  const { setModal } = useModal();

  function submitTransaction() {
    if (transactionType === "LOCK") {
      setModal({
        type: "LP_VAULT_TRANSACTION",
        transactionType: "LOCK",
        parsedValue,
      });
      return;
    }
    if (vaultTokenBalance?.butter.status !== "success") {
      return;
    }
    setModal({
      type: "LP_VAULT_TRANSACTION",
      transactionType: "UNLOCK",
      parsedValue: vaultTokenBalance.butter.value,
    });
  }

  return (
    <AccordionItem
      value="first"
      className="grid w-full flex-col dark:bg-breadgray-grey200 border-2 rounded-xl dark:border-breadgray-burnt hover:border-breadgray-light-grey"
    >
      <AccordionHeader className="p-4 flex flex-col gap-6 md:gap-2">
        <AccordionTrigger className="flex flex-col gap-6 group">
          <div className="flex w-full">
            <div className="flex pr-4">
              <BreadIcon />
              <div className="transform -translate-x-1">
                <WXDAIIcon />
              </div>
            </div>
            <h2 className="grow text-left font-medium text-xl">
              {lpTokenMeta[tokenAddress].poolName}
            </h2>

            {/* desktop token balances */}
            <div className="hidden md:flex pr-2 gap-4 items-center">
              <div className="flex gap-2">
                Unlocked LP tokens:
                {lpTokenBalance.status === "success" ? (
                  <span className="font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
                    {formatBalance(
                      Number(formatUnits(lpTokenBalance.data as bigint, 18)),
                      3
                    )}
                  </span>
                ) : (
                  "-"
                )}
              </div>
              <GradientBorder>
                <div className="rounded-full px-4 bg-breadpink-600 dark:bg-[#30252E] dark:bg-opacity-100 text-breadgray-rye dark:text-breadgray-grey flex gap-2">
                  Locked tokens:
                  {user.status === "CONNECTED" ? (
                    <span className="font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
                      {vaultTokenBalance?.butter.status === "success"
                        ? formatBalance(
                            Number(
                              formatUnits(vaultTokenBalance.butter.value, 18)
                            ),
                            3
                          )
                        : "-"}
                    </span>
                  ) : (
                    "-"
                  )}
                </div>
              </GradientBorder>
            </div>
            <div className="size-6 text-breadgray-grey100 dark:text-breadgray-ultra-white">
              <svg
                className="w-full h-full fill-current group-data-[state=open]:rotate-180"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7 8H5V10H7V12H9V14H11V16H13V14H15V12H17V10H19V8H17V10H15V12H13V14H11V12H9V10H7V8Z"
                />
              </svg>
            </div>
          </div>
        </AccordionTrigger>
        <div className="flex gap-4 md:pl-16">
          <ExternalLink href={lpTokenMeta[tokenAddress].visitPool}>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium dark:text-breadgray-ultra-white">
                Visit pool on Curve
              </span>
              <div className="text-breadpink-shaded">
                <LinkIcon />
              </div>
            </div>
          </ExternalLink>

          <ExternalLink href={lpTokenMeta[tokenAddress].inspectContract}>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium dark:text-breadgray-ultra-white">
                Inspect vault contract
              </span>
              <div className="text-breadpink-shaded">
                <LinkIcon />
              </div>
            </div>
          </ExternalLink>
        </div>

        {/* mobile token balances */}
        <div className="w-full flex flex-col md:hidden pr-2 gap-4 items-center">
          <div className="w-full flex px-3">
            <div className="grow text-left">Unlocked LP tokens:</div>
            {lpTokenBalance.status === "success" ? (
              <span className="font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
                {formatBalance(
                  Number(formatUnits(lpTokenBalance.data as bigint, 18)),
                  3
                )}
              </span>
            ) : (
              "-"
            )}
          </div>
          <div className="w-full">
            <GradientBorder>
              <div className="flex rounded-full px-3 bg-breadpink-600 dark:bg-[#30252E] dark:bg-opacity-100 text-breadgray-grey">
                <div className="grow text-left text-breadgray-rye dark:text-breadgray-grey">
                  Locked tokens:
                </div>
                <span className="font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
                  {user.status === "CONNECTED"
                    ? vaultTokenBalance?.butter.status === "success"
                      ? formatBalance(
                          Number(
                            formatUnits(vaultTokenBalance.butter.value, 18)
                          ),
                          3
                        )
                      : "-"
                    : "-"}
                </span>
              </div>
            </GradientBorder>
          </div>
        </div>
      </AccordionHeader>
      <AccordionContent className="p-4 pt-4 md:px-20">
        <div className="grid grid-cols-2 gap-5">
          <section className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <h2 className="font-bold text-xl">
              Lock LP tokens, get voting power
            </h2>
            <p>
              Enter a desired amount of LP tokens to lock to receive voting
              power.
              <p className="pt-4">
                The amount you choose to lock can always be retrieved by
                selecting the unlock button.
              </p>
            </p>
          </section>
          <div className="col-span-2 lg:col-span-1">
            <div className="py-4">
              <SelectTransaction
                transactionType={transactionType}
                setTransactionType={setTransactionType}
              />
            </div>
            <div className="text-xs text-breadgray-rye dark:text-breadgray-grey pb-2">
              {transactionType === "LOCK" ? "You deposit" : "You withdraw"}
            </div>
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submitTransaction();
              }}
            >
              <div className="flex flex-col gap-3 px-[10px] py-4 dark:bg-breadgray-charcoal rounded-md border border-breadgray-lightgrey dark:border-breadgray-rye">
                <div className="flex gap-4 items-center">
                  {transactionType === "LOCK" ? (
                    <input
                      type="text"
                      value={inputValue}
                      className="text-breadgray-ultra-lightgrey bg-[#00000000] font-bold text-2xl placeholder-breadgray-grey100 dark:placeholder-neutral-200 w-0 grow shrink"
                      onChange={(event) => {
                        setInputValue(sanitizeInputValue(event.target.value));
                      }}
                      placeholder="0"
                      inputMode="decimal"
                      autoComplete="off"
                      autoCorrect="off"
                      pattern="^[0-9]*[.,]?[0-9]*$"
                      minLength={1}
                      maxLength={79}
                      spellCheck="false"
                    />
                  ) : (
                    <div className="font-bold text-2xl grow">
                      <div className="truncate">
                        {vaultTokenBalance?.butter.status === "success"
                          ? formatBalance(
                              Number(
                                formatUnits(vaultTokenBalance.butter.value, 18)
                              ),
                              3
                            )
                          : "-"}
                      </div>
                    </div>
                  )}
                  <div className="rounded-full flex gap-2 items-center px-1.5 py-[0.15625rem] dark:bg-white/[0.05] shadow-[0_4px_10px_0px_#0000001A] text-breadgray-grey100 dark:shadow-none">
                    <WXDaiBreadIcon />
                    <div className="font-semibold dark:text-breadgray-ultra-white md:text-xl">
                      {lpTokenMeta[tokenAddress].tokenName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2.5 text-xs dark:text-breadgray-grey">
                  {transactionType === "LOCK" ? (
                    <>
                      <span>Unlocked LP tokens: </span>
                      {lpTokenBalance.status === "success"
                        ? formatBalance(
                            Number(
                              formatUnits(lpTokenBalance.data as bigint, 18)
                            ),
                            3
                          )
                        : "-"}
                      <MaxButton
                        onClick={() => {
                          if (lpTokenBalance.status !== "success") return;
                          setInputValue(
                            formatUnits(lpTokenBalance.data as bigint, 18)
                          );
                        }}
                      >
                        Max.
                      </MaxButton>
                    </>
                  ) : (
                    <span className="h-4"> </span>
                  )}
                </div>
              </div>
              {user.status === "CONNECTED" ? (
                <Button
                  size="large"
                  onClick={() => {
                    submitTransaction();
                  }}
                  disabled={
                    (transactionType === "LOCK" && !(Number(inputValue) > 0)) ||
                    (transactionType === "UNLOCK" &&
                      vaultTokenBalance?.butter.status === "success" &&
                      !(Number(vaultTokenBalance?.butter.value) > 0))
                  }
                >
                  {transactionType === "UNLOCK" ? "Unlock" : "Lock"} LP Tokens
                </Button>
              ) : (
                <AccountMenu fullWidth={true} size="large">
                  Connect
                </AccountMenu>
              )}
            </form>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
