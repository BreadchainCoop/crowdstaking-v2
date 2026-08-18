"use client";

import { useState } from "react";
import clsx from "clsx";
import { formatUnits } from "viem";
import {
  ArrowLineDownIcon,
  ArrowLineUpIcon,
  ArrowUpRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import { blo } from "blo";
import { useEnsName, useReadContract } from "wagmi";
import { Body, Heading1, Heading2, LiftedButton } from "@breadcoop/ui";

import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";
import { useVaultAPY } from "@/app/core/hooks/useVaultAPY";
import { useModal } from "@/app/core/context/ModalContext";
import {
  formatBalance,
  formatDate,
  truncateAddress,
} from "@/app/core/util/formatter";
import { DISTRIBUTOR_ABI } from "@/abi";
import { useCycleLength } from "@/app/governance/useCycleLength";
import { WRAPPER_CLASSES } from "@/app/core/util/classes";
import { LoginButton } from "@/app/components/login-button";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import SwapWrapper from "@/app/components/SwapWrapper";
import { useUserVoteCount } from "@/app/governance/useUserVoteCount";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { CURVE_SWAP_URL, GNOSIS_LINK } from "@/constants";
import { useAccountHistory, AccountHistoryEntry } from "./useAccountHistory";

const CARD_CLASSES = "bg-paper-0 border border-paper-2 p-5";

export function ProfilePage() {
  const { user } = useConnectedUser();
  const { BREAD } = useTokenBalances();
  const { data: apyData } = useVaultAPY();
  const chainConfig = useActiveChain();
  const { cycleLength } = useCycleLength();
  const { setModal } = useModal();

  const userAddress = "address" in user ? user.address : undefined;
  const { totalVotes, isLoading: votesLoading } =
    useUserVoteCount(userAddress);

  const breadBalance =
    BREAD?.status === "SUCCESS" ? parseFloat(BREAD.value) : 0;

  const apyRate = apyData ? Number(formatUnits(apyData, 18)) : 0;
  const apyPercent = apyData ? Number(formatUnits(apyData, 16)) : 0;
  const annualDonation = breadBalance * apyRate;

  // Actual voting power is the distributor's getCurrentVotingPower normalised by
  // the cycle length (the same value the governance UI shows), NOT the raw
  // ButteredBread balance.
  const { data: currentVotingPowerData } = useReadContract({
    address: chainConfig.DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "getCurrentVotingPower",
    args: userAddress ? [userAddress] : undefined,
    chainId: chainConfig.ID,
    query: { enabled: Boolean(userAddress) },
  });
  const votingPower =
    currentVotingPowerData !== undefined &&
    cycleLength.status === "SUCCESS" &&
    cycleLength.data > 0
      ? Number(formatUnits(currentVotingPowerData as bigint, 18)) /
        cycleLength.data
      : null;

  const handleBake = () => {
    setModal({
      type: "GENERIC_MODAL",
      showCloseButton: false,
      includeContainerStyling: false,
      children: <SwapWrapper />,
      className: "max-w-[30rem]",
    });
  };

  if (user.status === "NOT_CONNECTED" || user.status === "UNSUPPORTED_CHAIN") {
    return (
      <div
        className={clsx(
          WRAPPER_CLASSES,
          "flex flex-col items-center justify-center py-32 text-center",
        )}
      >
        <Body className="text-surface-grey-2 mb-6">
          {user.status === "NOT_CONNECTED"
            ? "Connect your wallet to view your account"
            : "Switch to Gnosis Chain to view your account"}
        </Body>
        <div className="w-full max-w-xs">
          <LoginButton user={user} />
        </div>
      </div>
    );
  }

  const [balInt, balDec] = formatBalance(breadBalance, 2).split(".");
  const [donInt, donDec] = formatBalance(annualDonation, 2).split(".");
  const [vpInt, vpDec] =
    votingPower !== null
      ? formatBalance(votingPower, 2).split(".")
      : ["—", null];
  const [apyInt, apyDec] = formatBalance(apyPercent, 1).split(".");

  return (
    <div className={clsx(WRAPPER_CLASSES, "py-8")}>
      <Heading1 className="font-breadDisplay font-black text-primary-orange text-[2.5rem] tracking-[-0.02em] mb-8">
        My account
      </Heading1>

      <div className="flex flex-col gap-3">
        {/* ── Profile ── */}
        <ProfileCard address={userAddress} />

        {/* ── Balance + Solidarity Fund stats ── */}
        <div className={clsx(CARD_CLASSES, "md:p-8 flex flex-col gap-6")}>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-end leading-none">
              <span className="font-breadDisplay font-black text-orange-2 text-[64px] leading-14 tracking-[-0.03em]">
                ${balInt}
              </span>
              <span className="font-breadDisplay font-black text-orange-2 text-[64px] leading-14 tracking-[-0.03em]">
                .{balDec}
              </span>
            </div>
            <Body className="font-bold text-surface-grey text-2xl">
              Total balance
            </Body>
            <Body className="font-bold text-surface-grey text-xs">
              All funds are $BREAD
            </Body>

            <div className="flex gap-3.75 items-center flex-wrap justify-center sm:flex-nowrap w-full max-w-md">
              <div className="lifted-button-container flex-1">
                <LiftedButton onClick={handleBake}>Deposit</LiftedButton>
              </div>
              <a
                href={CURVE_SWAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lifted-button-container flex-1"
              >
                <LiftedButton
                  preset="secondary"
                  leftIcon={<ArrowUpRightIcon />}
                >
                  Withdraw
                </LiftedButton>
              </a>
            </div>
          </div>

          <div className="mx-auto h-px w-full max-w-[500px] bg-paper-2" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total annual donation">
              <DisplayNumber prefix="$" int={donInt} dec={donDec} />
            </StatCard>
            <StatCard label="Total voting power">
              <div className="flex items-center gap-2.75">
                <span className="shrink-0">
                  <FistIcon />
                </span>
                <DisplayNumber int={vpInt} dec={vpDec} />
              </div>
            </StatCard>
            <StatCard label="APY">
              <DisplayNumber int={apyInt} dec={apyDec} suffix="%" />
            </StatCard>
            <StatCard label="Votes casted">
              <DisplayNumber int={votesLoading ? "—" : String(totalVotes)} />
            </StatCard>
          </div>
        </div>

        {/* ── Account history ── */}
        <AccountHistoryCard address={userAddress} />
      </div>
    </div>
  );
}

function ProfileCard({ address }: { address?: `0x${string}` }) {
  const { data: ensName } = useEnsName({
    address,
    query: { enabled: Boolean(address) },
  });

  if (!address) return null;

  return (
    <div className={clsx(CARD_CLASSES, "flex items-center gap-4")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={blo(address)}
        alt=""
        className="size-14 shrink-0 rounded-full"
      />
      <div className="flex min-w-0 flex-col gap-1">
        <Body className="text-surface-grey">Username</Body>
        <Body bold className="text-lg text-surface-ink truncate">
          {ensName || truncateAddress(address)}
        </Body>
        <div className="flex items-center gap-2 text-surface-grey">
          <Body className="text-surface-grey">{truncateAddress(address)}</Body>
          <button
            type="button"
            onClick={() => copyToClipboard(address)}
            aria-label="Copy address"
            className="transition-colors hover:text-surface-ink"
          >
            <CopyIcon size={20} />
          </button>
          <a
            href={GNOSIS_LINK + address}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on block explorer"
            className="transition-colors hover:text-surface-ink"
          >
            <ArrowUpRightIcon size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}

const HISTORY_META: Record<
  AccountHistoryEntry["type"],
  { label: string; icon: React.ReactNode }
> = {
  deposit: { label: "Deposit", icon: <ArrowLineDownIcon size={22} /> },
  withdraw: { label: "Withdrawal", icon: <ArrowLineUpIcon size={22} /> },
  vote: { label: "Voted", icon: <FistIcon /> },
};

function historyDetail(entry: AccountHistoryEntry): string {
  if (entry.type === "deposit")
    return `Baked ${formatBalance(entry.amount ?? 0, 2)} BREAD`;
  if (entry.type === "withdraw")
    return `Unbaked ${formatBalance(entry.amount ?? 0, 2)} BREAD`;
  const count = entry.projectCount ?? 0;
  return `Voted across ${count} project${count === 1 ? "" : "s"}`;
}

const HISTORY_PAGE_SIZE = 5;

function AccountHistoryCard({ address }: { address?: `0x${string}` }) {
  const chainConfig = useActiveChain();
  const { history, isLoading } = useAccountHistory(address);
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(history.length / HISTORY_PAGE_SIZE);
  // Clamp in case the list shrank (e.g. a refetch) below the current page.
  const safePage = Math.min(page, Math.max(pageCount - 1, 0));
  const start = safePage * HISTORY_PAGE_SIZE;
  const pageItems = history.slice(start, start + HISTORY_PAGE_SIZE);

  return (
    <div className={clsx(CARD_CLASSES, "md:p-8 flex flex-col gap-6")}>
      <div className="flex items-center justify-between gap-4">
        <Heading2 className="font-breadDisplay font-black text-surface-ink text-2xl tracking-[-0.02em]">
          Account history
        </Heading2>

        {pageCount > 1 && (
          <div className="flex items-center gap-3">
            <Body className="text-surface-grey text-sm whitespace-nowrap">
              {start + 1}–{start + pageItems.length} of {history.length}
            </Body>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(safePage - 1)}
                disabled={safePage === 0}
                aria-label="Previous page"
                className="flex size-8 items-center justify-center border border-paper-2 text-surface-ink transition-colors enabled:hover:bg-paper-1 disabled:opacity-30"
              >
                <CaretLeftIcon size={16} />
              </button>
              <button
                type="button"
                onClick={() => setPage(safePage + 1)}
                disabled={safePage >= pageCount - 1}
                aria-label="Next page"
                className="flex size-8 items-center justify-center border border-paper-2 text-surface-ink transition-colors enabled:hover:bg-paper-1 disabled:opacity-30"
              >
                <CaretRightIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <Body className="text-surface-grey">Loading activity…</Body>
      ) : history.length === 0 ? (
        <Body className="text-surface-grey">No account activity yet.</Body>
      ) : (
        <ul className="flex flex-col gap-4">
          {pageItems.map((entry) => {
            const meta = HISTORY_META[entry.type];
            const explorerTx =
              chainConfig.EXPLORER && chainConfig.EXPLORER !== "NONE"
                ? `${chainConfig.EXPLORER}/tx/${entry.txHash}`
                : null;

            return (
              <li
                key={`${entry.type}-${entry.txHash}`}
                className="flex items-center gap-4"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-paper-1 text-orange-2">
                  {meta.icon}
                </span>
                <div className="flex min-w-0 flex-col">
                  <Body bold className="text-surface-ink">
                    {meta.label}
                  </Body>
                  <div className="flex items-center gap-2 text-surface-grey">
                    <Body className="text-surface-grey">
                      {historyDetail(entry)}
                    </Body>
                    {explorerTx && (
                      <a
                        href={explorerTx}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View transaction on block explorer"
                        className="transition-colors hover:text-surface-ink"
                      >
                        <ArrowUpRightIcon size={18} />
                      </a>
                    )}
                  </div>
                </div>
                <Body className="text-surface-grey text-sm shrink-0 ml-auto whitespace-nowrap">
                  {formatDate(new Date(entry.timestamp))}
                </Body>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function StatCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper-1 p-5 flex flex-col items-center justify-center gap-2.75 min-h-32.75">
      <div className="flex items-end">{children}</div>
      <Body className="font-bold text-base text-surface-grey text-center">
        {label}
      </Body>
    </div>
  );
}

function DisplayNumber({
  prefix,
  int: intPart,
  dec,
  suffix,
}: {
  prefix?: string;
  int: string;
  dec?: string | null;
  suffix?: string;
}) {
  return (
    <div className="flex items-end leading-none gap-0.5">
      {prefix && (
        <span className="font-breadDisplay font-black text-[48px] leading-12 tracking-[-0.02em] text-surface-ink">
          {prefix}
        </span>
      )}
      <span className="font-breadDisplay font-black text-[48px] leading-12 tracking-[-0.02em] text-surface-ink">
        {intPart}
      </span>
      {dec && (
        <span className="font-breadBody font-bold text-[24px] leading-none text-surface-ink mb-0.5">
          .{dec}
        </span>
      )}
      {suffix && (
        <span className="font-breadDisplay font-black text-[48px] leading-12 tracking-[-0.02em] text-surface-ink">
          {suffix}
        </span>
      )}
    </div>
  );
}
