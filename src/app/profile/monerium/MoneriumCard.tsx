"use client";

import { useEffect } from "react";
import clsx from "clsx";
import { formatUnits, type Address } from "viem";
import { useReadContract } from "wagmi";
import {
  ArrowUpRightIcon,
  BankIcon,
  CheckCircleIcon,
  CopyIcon,
  LinkBreakIcon,
  LockSimpleIcon,
} from "@phosphor-icons/react";
import { Body, Heading2, LiftedButton } from "@breadcoop/ui";

import { ERC20_ABI } from "@/abi";
import { EURE_ADDRESS } from "@/constants";
import { useToast } from "@/app/core/context/ToastContext/ToastContext";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import {
  formatBalance,
  truncateAddress,
} from "@/app/core/util/formatter";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { MONERIUM_CHAIN, useMonerium } from "./useMonerium";

const CARD_CLASSES = "bg-paper-0 border border-paper-2 p-5";

const COPY_BUTTON =
  "transition-colors hover:text-surface-ink text-surface-grey shrink-0";

/**
 * "Monerium euro account" card for the My Account page.
 *
 * Lets a member connect their Monerium account (OAuth), see their IBAN and
 * EURe balance, register the wallet they use on this app as a Monerium owned
 * address, and follow the bank → EURe → xDAI → BREAD path into the
 * Solidarity Fund.
 */
export function MoneriumCard({
  address,
  isSafe,
  onSwapEure,
  onBake,
}: {
  address: Address | undefined;
  isSafe: boolean;
  onSwapEure: () => void;
  onBake: () => void;
}) {
  // Feature-gated: nothing renders unless the deployment is configured.
  if (!process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID) return null;

  return (
    <MoneriumCardContent
      address={address}
      isSafe={isSafe}
      onSwapEure={onSwapEure}
      onBake={onBake}
    />
  );
}

function MoneriumCardContent({
  address,
  isSafe,
  onSwapEure,
  onBake,
}: {
  address: Address | undefined;
  isSafe: boolean;
  onSwapEure: () => void;
  onBake: () => void;
}) {
  const { toastDispatch } = useToast();
  const { context, connect, disconnect, linkWallet, moveIban } = useMonerium(
    address,
    isSafe
  );

  // Toast + clean up the OAuth redirect result (?monerium=…) on the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("monerium");
    if (!result) return;

    if (result === "connected") {
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "success",
          message: "Monerium account connected",
        },
      });
    } else if (result === "denied") {
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "neutral",
          message: "Monerium connection was cancelled",
        },
      });
    } else {
      toastDispatch({
        type: "CUSTOM",
        payload: {
          variant: "error",
          message: "Could not connect to Monerium, please try again",
        },
      });
    }

    params.delete("monerium");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = context.data;
  const connected = data != null;

  return (
    <div className={clsx(CARD_CLASSES, "md:p-8 flex flex-col gap-6")}>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-paper-1 text-orange-2 shrink-0">
            <BankIcon size={26} />
          </span>
          <div>
            <Heading2 className="font-breadDisplay font-black text-surface-ink text-2xl tracking-[-0.02em]">
              Monerium euro account
            </Heading2>
            <Body className="text-surface-grey text-xs">
              Personal IBAN · euros in, EURe on {chainName()}
            </Body>
          </div>
        </div>

        {connected ? (
          <div className="flex items-center gap-3 shrink-0">
            <span className="rounded-full border border-[#31a800] bg-[#31a800]/10 text-[#1f7a00] px-2.5 py-1 text-xs font-bold">
              Connected
            </span>
            <button
              type="button"
              onClick={() => disconnect.mutate()}
              disabled={disconnect.isPending}
              aria-label="Disconnect Monerium"
              title="Disconnect Monerium"
              className={clsx(COPY_BUTTON, "disabled:opacity-40")}
            >
              <LinkBreakIcon size={20} />
            </button>
          </div>
        ) : null}
      </div>

      {context.isLoading ? (
        <Body className="text-surface-grey">Loading Monerium…</Body>
      ) : !connected || !data ? (
        <NotConnected onClick={connect} />
      ) : (
        <ConnectedCard
          address={address}
          isSafe={isSafe}
          context={data}
          linkWallet={linkWallet}
          moveIban={moveIban}
          onSwapEure={onSwapEure}
          onBake={onBake}
        />
      )}
    </div>
  );
}

function NotConnected({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <Body className="text-surface-grey">
        Connect your Monerium account to get a personal IBAN. Euros sent there
        are minted 1:1 as EURe to your wallet on {chainName()} — swap them for
        xDAI and bake them into BREAD.
      </Body>
      <div className="lifted-button-container max-w-xs">
        <LiftedButton onClick={onClick}>Connect Monerium</LiftedButton>
      </div>
      <Body className="text-surface-grey text-xs flex items-center gap-1.5">
        <LockSimpleIcon size={14} className="shrink-0" />
        We only ask for read access plus linking your wallet — funds always
        stay in your control.
      </Body>
    </div>
  );
}

function ConnectedCard({
  address,
  isSafe,
  context,
  linkWallet,
  moveIban,
  onSwapEure,
  onBake,
}: {
  address: Address | undefined;
  isSafe: boolean;
  context: NonNullable<ReturnType<typeof useMonerium>["context"]["data"]>;
  linkWallet: ReturnType<typeof useMonerium>["linkWallet"];
  moveIban: ReturnType<typeof useMonerium>["moveIban"];
  onSwapEure: () => void;
  onBake: () => void;
}) {
  const { toastDispatch } = useToast();

  const profile =
    context.profiles.find((p) => p.id === context.authContext.defaultProfile) ??
    context.profiles[0];

  const approvedIban =
    context.ibans.find(
      (iban) => iban.state === "approved" && iban.chain === MONERIUM_CHAIN
    ) ?? context.ibans.find((iban) => iban.state === "approved");
  const pendingIban = context.ibans.find(
    (iban) => iban.state !== "approved"
  );

  const walletLinked = Boolean(
    address &&
      context.addresses.some(
        (a) =>
          a.address.toLowerCase() === address.toLowerCase() &&
          a.chains.includes(MONERIUM_CHAIN)
      )
  );

  const ibanPointsHere =
    Boolean(address && approvedIban) &&
    approvedIban!.address.toLowerCase() === address?.toLowerCase() &&
    approvedIban!.chain === MONERIUM_CHAIN;

  const readyForFlow = walletLinked && Boolean(approvedIban) && ibanPointsHere;

  const handleLink = () => {
    linkWallet.mutate(undefined, {
      onSuccess: (data: { pending?: boolean }) => {
        toastDispatch({
          type: "CUSTOM",
          payload: {
            variant: "success",
            message: data?.pending
              ? "Link requested — Monerium will verify your wallet on-chain"
              : "Wallet linked to your Monerium account",
          },
        });
      },
      onError: (error) => {
        toastDispatch({
          type: "CUSTOM",
          payload: {
            variant: "error",
            message: error.message.includes("User rejected")
              ? "Signature request was rejected"
              : "Could not link your wallet to Monerium",
          },
        });
      },
    });
  };

  const handleMoveIban = () => {
    moveIban.mutate(undefined, {
      onSuccess: () => {
        toastDispatch({
          type: "CUSTOM",
          payload: {
            variant: "success",
            message: "Your IBAN now mints EURe to this wallet",
          },
        });
      },
      onError: (error: Error) => {
        toastDispatch({
          type: "CUSTOM",
          payload: {
            variant: "error",
            message:
              error.message === "no_active_iban"
                ? "No approved IBAN on your Monerium account yet"
                : "Could not update your IBAN",
          },
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Identity / KYC ── */}
      <div className="flex items-center justify-between gap-4">
        <Body bold className="text-surface-ink truncate">
          {profile?.name ?? context.authContext.name}
        </Body>
        {profile && profile.state !== "approved" ? (
          <span className="rounded-full border border-orange-2 bg-orange-2/10 text-orange-2 px-2.5 py-1 text-xs font-bold shrink-0">
            KYC {profile.state}
          </span>
        ) : null}
      </div>

      {/* ── IBAN ── */}
      {approvedIban ? (
        <div className="bg-paper-1 p-5 flex flex-col gap-3">
          <Body className="font-bold text-surface-grey text-sm">
            Your IBAN — send euros here
          </Body>
          <div className="flex items-center gap-2">
            <code className="font-breadBody font-bold text-lg text-surface-ink tracking-wide break-all">
              {formatIban(approvedIban.iban)}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(approvedIban.iban)}
              aria-label="Copy IBAN"
              className={COPY_BUTTON}
            >
              <CopyIcon size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Body className="text-surface-grey text-xs">BIC</Body>
            <code className="text-surface-grey text-xs">{approvedIban.bic}</code>
          </div>

          {ibanPointsHere ? (
            <Body className="text-surface-grey text-xs flex items-center gap-1.5">
              <CheckCircleIcon size={14} weight="fill" className="text-[#31a800] shrink-0" />
              SEPA payments to this IBAN are minted as EURe to{" "}
              {truncateAddress(approvedIban.address)} on {chainName()}
            </Body>
          ) : (
            <div className="flex flex-col gap-2">
              <Body className="text-xs text-orange-2">
                This IBAN currently mints EURe to{" "}
                {truncateAddress(approvedIban.address)} (
                {approvedIban.chain}) — not to the wallet you use here.
              </Body>
              <div className="lifted-button-container max-w-xs">
                <LiftedButton
                  preset="secondary"
                  onClick={handleMoveIban}
                  disabled={moveIban.isPending}
                >
                  {moveIban.isPending
                    ? "Updating…"
                    : "Receive EURe here instead"}
                </LiftedButton>
              </div>
            </div>
          )}
        </div>
      ) : pendingIban ? (
        <div className="bg-paper-1 p-5">
          <Body className="text-surface-grey">
            Your IBAN ({pendingIban.state}) will appear here once Monerium has
            approved your account.
          </Body>
        </div>
      ) : (
        <div className="bg-paper-1 p-5">
          <Body className="text-surface-grey">
            No IBAN yet — complete onboarding in the Monerium app and your IBAN
            will appear here.
          </Body>
        </div>
      )}

      {/* ── Wallet link ── */}
      {walletLinked ? (
        <Body className="text-surface-grey flex items-center gap-2">
          <CheckCircleIcon size={18} weight="fill" className="text-[#31a800] shrink-0" />
          This wallet is linked to your Monerium account
        </Body>
      ) : address ? (
        <div className="flex flex-col gap-3">
          <Body className="text-surface-grey">
            Link {truncateAddress(address)} to your Monerium account so EURe
            can be minted straight to it.
          </Body>
          <Body className="text-surface-grey text-xs">
            {isSafe
              ? "Monerium will verify your Safe wallet on-chain (ERC-1271) — no signature needed."
              : `You'll sign one message in your wallet: “I hereby declare that I am the address owner.”`}
          </Body>
          <div className="lifted-button-container max-w-xs">
            <LiftedButton
              onClick={handleLink}
              disabled={linkWallet.isPending}
            >
              {linkWallet.isPending ? "Linking…" : "Link this wallet"}
            </LiftedButton>
          </div>
        </div>
      ) : null}

      {/* ── Bank → BREAD steps ── */}
      <div className="flex flex-col gap-4 border-t border-paper-2 pt-6">
        <Body className="font-bold text-surface-grey text-sm">
          From bank to BREAD in three steps
        </Body>
        <ol className="flex flex-col gap-3">
          <Step number={1} done={Boolean(approvedIban && ibanPointsHere)}>
            <Body className="text-surface-grey">
              Send euros from any bank account to your IBAN — EURe is minted
              1:1 to your wallet on {chainName()}.
            </Body>
          </Step>
          <Step number={2}>
            <div className="flex flex-col gap-2">
              <Body className="text-surface-grey">
                Swap EURe for xDAI in the app.
              </Body>
              <div className="lifted-button-container max-w-xs">
                <LiftedButton preset="secondary" onClick={onSwapEure}>
                  Swap EURe → xDAI
                </LiftedButton>
              </div>
            </div>
          </Step>
          <Step number={3}>
            <div className="flex flex-col gap-2">
              <Body className="text-surface-grey">
                Bake xDAI into BREAD to join the Solidarity Fund.
              </Body>
              <div className="lifted-button-container max-w-xs">
                <LiftedButton onClick={onBake}>Bake BREAD</LiftedButton>
              </div>
            </div>
          </Step>
        </ol>
        {!readyForFlow ? (
          <Body className="text-surface-grey text-xs">
            Finish linking your wallet{approvedIban ? "" : " and IBAN"} above
            to complete the flow.
          </Body>
        ) : null}
      </div>

      {/* ── EURe balance ── */}
      {address ? <EureBalance address={address} onSwapEure={onSwapEure} /> : null}

      <Body className="text-surface-grey-2 text-xs">
        EURe is e-money issued by Monerium, a licensed EU e-money institution.
        Connecting only shares your Monerium account details with this app.
      </Body>
    </div>
  );
}

function EureBalance({
  address,
  onSwapEure,
}: {
  address: Address;
  onSwapEure: () => void;
}) {
  const chainConfig = useActiveChain();
  const isGnosis = chainConfig.ID === 100;

  const { data: balance } = useReadContract({
    address: EURE_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address],
    chainId: 100,
    query: { enabled: isGnosis },
  });

  if (!isGnosis) return null;

  const value =
    balance !== undefined ? parseFloat(formatUnits(balance, 18)) : 0;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-paper-2 pt-6">
      <div className="flex flex-col">
        <Body className="font-bold text-surface-grey text-sm">
          EURe in this wallet
        </Body>
        <Body className="text-surface-grey text-xs">
          On {chainName()}, ready to swap
        </Body>
      </div>
      <div className="flex items-end gap-4">
        <span className="font-breadDisplay font-black text-3xl text-surface-ink tracking-[-0.02em]">
          {formatBalance(value, 2)}
        </span>
        {value > 0 ? (
          <button
            type="button"
            onClick={onSwapEure}
            aria-label="Swap EURe for xDAI"
            className={clsx(COPY_BUTTON, "flex items-center gap-1 text-sm font-bold mb-1")}
          >
            Swap <ArrowUpRightIcon size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Step({
  number,
  done,
  children,
}: {
  number: number;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={clsx(
          "flex size-7 shrink-0 items-center justify-center rounded-full font-bold text-sm",
          done ? "bg-[#31a800] text-white" : "bg-paper-1 text-surface-grey"
        )}
      >
        {number}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

/** Group an IBAN in blocks of four for readability. */
function formatIban(iban: string): string {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

/** Human name of the Monerium chain for the configured environment. */
function chainName(): string {
  return MONERIUM_CHAIN === "gnosis" ? "Gnosis" : "Chiado (testnet)";
}
