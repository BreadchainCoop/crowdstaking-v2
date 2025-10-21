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
import {
  Logo,
  Body,
  LiftedButton,
  Heading5,
  Heading4,
  Caption,
} from "@breadcoop/ui";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { SelectTransaction } from "./SelectTransaction";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { WXDAIIcon, BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { ExternalLink } from "@/app/core/components/ExternalLink";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { lpTokenMeta } from "@/app/lpTokenMeta";
import { WXDaiBreadIcon } from "@/app/core/components/Modal/LPVaultTransactionModal/VPRate";
import { MaxButton } from "@/app/core/components/MaxButton";
import { useTransactions } from "@/app/core/context/TransactionsContext/TransactionsContext";
import { formatBalance } from "@/app/core/util/formatter";
import { useVaultTokenBalance } from "../context/VaultTokenBalanceContext";
import { AccountMenu } from "@/app/core/components/Header/AccountMenu";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { ArrowUpRightIcon, CaretDownIcon } from "@phosphor-icons/react/ssr";

export type TransactionType = "LOCK" | "UNLOCK";

export function VaultPanel({ tokenAddress }: { tokenAddress: Hex }) {
  const { openChainModal } = useChainModal();
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
      className="grid w-full flex-col border-2 border-paper-0 rounded-sm bg-bread-paper"
    >
      <AccordionHeader className="flex flex-col gap-6 md:gap-2">
        <AccordionTrigger className="flex flex-col py-8 px-4 gap-6 group">
          <div className="flex w-full flex-wrap">
            <div className="flex pr-4">
              <Logo size={24} color="orange" variant="square" />
              <div className="transform -translate-x-1">
                <WXDAIIcon />
              </div>
            </div>
            <Body bold className="grow text-[20px] text-left">
              {lpTokenMeta[tokenAddress].poolName}
            </Body>

            {/* Token balances */}
            <div className="flex w-full md:w-auto pr-2 gap-4 items-center mt-4 md:mt-0 order-3 md:order-2 flex-wrap">
              <div className="flex w-full md:w-auto justify-between gap-2 items-center px-4 md:px-2 mb-2 md:mb-0">
                <Body>Unlocked LP tokens:</Body>
                {lpTokenBalance?.status === "SUCCESS" ? (
                  <Body bold>{lpTokenBalance.value}</Body>
                ) : (
                  <span className="ml-auto">-</span>
                )}
              </div>

              <div className="w-full md:w-auto">
                <div className="flex w-full bg-paper-main border border-primary-orange md:w-auto justify-between px-4 py-1 items-center gap-2">
                  <Body>Locked LP tokens:</Body>
                  {user.status === "CONNECTED" ||
                  user.status === "UNSUPPORTED_CHAIN" ? (
                    <Body bold>
                      {vaultTokenBalance?.butter.status === "success"
                        ? formatBalance(
                            Number(
                              formatUnits(vaultTokenBalance.butter.value, 18)
                            ),
                            0
                          )
                        : "-"}
                    </Body>
                  ) : (
                    <span className="ml-auto">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Accordion toggle arrow */}
            <div className="size-6 order-2 md:order-3">
              <CaretDownIcon
                size={24}
                className="group-data-[state=open]:rotate-180 mt-1 text-primary-orange"
              />
            </div>
          </div>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent className="pt-2 pb-4 md:px-20">
        <div className="grid grid-cols-2 gap-5 px-5">
          <section className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            {transactionType === "LOCK" && (
              <>
                <Body bold>Lock LP tokens, get voting power</Body>
                <Body className="text-surface-grey">
                  Enter a desired amount of LP tokens to lock to receive voting
                  power.
                </Body>
                <Body className="text-surface-grey">
                  The amount you choose to lock can always be retrieved by
                  selecting the unlock button.
                </Body>
              </>
            )}
            {transactionType === "UNLOCK" && (
              <>
                <Body bold>Unlock LP tokens</Body>
                <Body className="text-surface-grey">
                  When unlocking your LP tokens you retrieve your curve
                  BREAD/XDAI-LP tokens back.
                </Body>
                <Body className="text-surface-grey">
                  You will no longer receive voting power for the next voting
                  cycles.
                </Body>
              </>
            )}
            <div className="flex flex-col gap-4 items-start">
              <ExternalLink href={lpTokenMeta[tokenAddress].visitPool}>
                <LiftedButton
                  preset="stroke"
                  className="h-[32px]"
                  rightIcon={
                    <ArrowUpRightIcon className="text-primary-orange" />
                  }
                >
                  Visit pool on Curve
                </LiftedButton>
              </ExternalLink>

              <ExternalLink href={lpTokenMeta[tokenAddress].inspectContract}>
                <LiftedButton
                  preset="stroke"
                  className="h-[32px]"
                  rightIcon={
                    <ArrowUpRightIcon className="text-primary-orange" />
                  }
                >
                  Inspect vault contract
                </LiftedButton>
              </ExternalLink>
            </div>
            {transactionType === "UNLOCK" && (
              <div>
                <Body className="text-system-warning">
                  <img
                    src="/WarningDiamond.svg"
                    alt="Warning"
                    width="20"
                    height="20"
                    className="inline-block align-middle mr-2"
                  />
                  You can only unlock ALL your locked LP tokens at once.
                </Body>
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
            <Caption className="pb-2">
              {transactionType === "LOCK" ? "You deposit" : "You withdraw"}
            </Caption>
            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                submitTransaction();
              }}
            >
              <div className="flex flex-col gap-3 bg-paper-1 border border-paper-2 px-[10px] py-4">
                <div className="flex gap-4 items-center">
                  {transactionType === "LOCK" ? (
                    <input
                      type="text"
                      value={inputValue}
                      className="ps-2 text-2xl  w-0 grow shrink"
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
                    <img
                      src="/WXDAIBread.svg"
                      alt="WXDAI Bread"
                      className="w-6 h-6"
                    />
                    <Body bold>{lpTokenMeta[tokenAddress].tokenName}</Body>
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
                        <Body>Max.</Body>
                      </MaxButton>
                    </>
                  ) : (
                    <>
                      <Body>Locked LP tokens: </Body>
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
                <LiftedButton
                  onClick={() => {
                    submitTransaction();
                  }}
                  width="full"
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
                </LiftedButton>
              ) : user.status === "UNSUPPORTED_CHAIN" ? (
                <Button
                  fullWidth={true}
                  size="large"
                  variant="danger"
                  onClick={() => openChainModal?.()}
                >
                  Change network
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
