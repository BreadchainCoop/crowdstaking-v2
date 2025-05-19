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
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
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

  const { BUTTER: lpTokenBalance } = useTokenBalances();
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

  const renderExternalLinkContent = (text: string) => {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">{text}</span>
        <div className="text-breadpink-shaded">
          <LinkIcon />
        </div>
      </div>
    );
  };

  return (
    <AccordionItem
      value="first"
      className="grid w-full flex-col dark:bg-breadgray-grey200 bg-breadgray-ultra-white border-2 rounded-xl dark:border-breadgray-burnt border-breadgray-light-grey hover:border-breadviolet-shaded"
    >
      <AccordionHeader className="flex flex-col gap-6 md:gap-2">
        <AccordionTrigger className="flex flex-col py-8 px-4 gap-6 group">
          <div className="flex w-full flex-wrap">
            <div className="flex pr-4">
              <BreadIcon />
              <div className="transform -translate-x-1">
                <WXDAIIcon />
              </div>
            </div>
            <h2 className="grow text-left font-medium text-xl">
              {lpTokenMeta[tokenAddress].poolName}
            </h2>

            {/* Token balances */}
            <div className="flex w-full md:w-auto pr-2 gap-4 items-center mt-4 md:mt-0 order-3 md:order-2 flex-wrap">
              <div className="flex w-full md:w-auto justify-between gap-2 items-center px-4 md:px-2 mb-2 md:mb-0">
                <div>Unlocked LP tokens:</div>
                {lpTokenBalance?.status === "SUCCESS" ? (
                  <span className="font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
                    {lpTokenBalance.value}
                  </span>
                ) : (
                  <span className="ml-auto">-</span>
                )}
              </div>

              <div className="w-full md:w-auto">
                <GradientBorder>
                  <div className="flex w-full md:w-auto justify-between rounded-full px-4 bg-breadpink-600 dark:bg-[#30252E] dark:bg-opacity-100 text-breadgray-rye dark:text-breadgray-grey items-center gap-2">
                    <div>Locked tokens:</div>
                    {user.status === "CONNECTED" ? (
                      <span className="font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
                        {vaultTokenBalance?.butter.status === "success"
                          ? formatBalance(
                              Number(
                                formatUnits(vaultTokenBalance.butter.value, 18)
                              ),
                              0
                            )
                          : "-"}
                      </span>
                    ) : (
                      <span className="ml-auto">-</span>
                    )}
                  </div>
                </GradientBorder>
              </div>
            </div>

            {/* Accordion toggle arrow */}
            <div className="size-6 text-breadgray-grey100 dark:text-breadgray-ultra-white order-2 md:order-3">
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
      </AccordionHeader>
      <AccordionContent className="pt-2 pb-4 md:px-20">
        <div className="grid grid-cols-2 gap-5 px-5">
          <section className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            {transactionType === "LOCK" && (
              <>
                <h2 className="font-bold text-xl">
                  Lock LP tokens, get voting power
                </h2>
                <p className="dark:text-breadgray-grey">
                  Enter a desired amount of LP tokens to lock to receive voting
                  power.
                </p>
                <p className="dark:text-breadgray-grey">
                  The amount you choose to lock can always be retrieved by
                  selecting the unlock button.
                </p>
              </>
            )}
            {transactionType === "UNLOCK" && (
              <>
                <h2 className="font-bold text-xl">Unlock LP tokens</h2>
                <p className="dark:text-breadgray-grey">
                  When unlocking your LP tokens you retrieve your curve
                  BREAD/XDAI-LP tokens back.
                </p>
                <p className="dark:text-breadgray-grey">
                  You will no longer receive voting power for the next voting
                  cycles.
                </p>
              </>
            )}
            <div className="flex gap-4">
              <ExternalLink href={lpTokenMeta[tokenAddress].visitPool}>
                {renderExternalLinkContent("Visit pool on Curve")}
              </ExternalLink>

              <ExternalLink href={lpTokenMeta[tokenAddress].inspectContract}>
                {renderExternalLinkContent("Inspect vault contract")}
              </ExternalLink>
            </div>
            {transactionType === "UNLOCK" && (
              <div>
                <p className="text-breadviolet-violet dark:text-status-warning flex font-bold items-start gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-breadviolet-violet dark:fill-status-warning inline-block align-middle mt-1"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 0H1.99976H2H15.9998V2H2V16H15.9998V18L2 18L1.99976 18L0 18V0ZM18 0H16V18H18V0ZM8 12.0001H10V14.0001H8V12.0001ZM10 4H8V10H10V4Z"
                    />
                  </svg>
                  You can only unlock ALL your locked LP tokens at once.
                </p>
              </div>
            )}
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
              <div className="flex flex-col gap-3 px-[10px] py-4 dark:bg-breadgray-charcoal bg-breadgray-ultra-white rounded-md border border-breadgray-lightgrey dark:border-breadgray-rye">
                <div className="flex gap-4 items-center">
                  {transactionType === "LOCK" ? (
                    <input
                      type="text"
                      value={inputValue}
                      className="text-breadgray-ultra-lightgrey bg-[#00000000] ps-2 font-bold text-2xl placeholder-breadgray-grey100 dark:placeholder-neutral-200 w-0 grow shrink"
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
                    <div className="font-bold text-2xl ps-2 grow">
                      <div className="truncate">
                        {vaultTokenBalance?.butter.status === "success"
                          ? formatBalance(
                              Number(
                                formatUnits(vaultTokenBalance.butter.value, 18)
                              ),
                              0
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
                      {lpTokenBalance?.status === "SUCCESS"
                        ? lpTokenBalance.value
                        : "-"}
                      <MaxButton
                        onClick={() => {
                          if (lpTokenBalance?.status !== "SUCCESS") return;
                          setInputValue(lpTokenBalance.value);
                        }}
                      >
                        Max.
                      </MaxButton>
                    </>
                  ) : (
                    <>
                      <span>Locked LP tokens: </span>
                      {vaultTokenBalance?.butter.status === "success"
                        ? formatBalance(
                            Number(
                              formatUnits(vaultTokenBalance.butter.value, 18)
                            ),
                            3
                          )
                        : "-"}
                    </>
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
                    (transactionType === "LOCK" &&
                      lpTokenBalance?.status === "SUCCESS" &&
                      !(Number(inputValue) <= Number(lpTokenBalance.value))) ||
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
