"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Body, LiftedButton } from "@breadcoop/ui";
import { buildPeerUrl } from "@/lib/peer";
import { PEER_FIATS, PEER_PLATFORMS, type PeerFiat } from "@/lib/peerSdk";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { useStrictMobile } from "@/hooks/use-is-device";
import { usePeerOnramp } from "./usePeerOnramp";
import { WalletAddressHint } from "./WalletAddressHint";

export function PeerBuy({ recipientAddress }: { recipientAddress?: string }) {
  const { isMobile } = useStrictMobile();
  const onramp = usePeerOnramp();

  // The in-app SDK flow needs a desktop browser (PeerAuth extension) and a
  // connected wallet. Otherwise fall back to the guided link-out.
  const canUseInApp = !isMobile && onramp.isConnected;

  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <div className="flex items-center gap-3 mb-4">
          <img src="https://www.peer.xyz/logo192.png" alt="Peer" className="h-10 w-10" />
          <Body className="text-base font-bold text-surface-ink">Buy with Peer</Body>
        </div>
        {canUseInApp ? (
          <PeerInApp onramp={onramp} />
        ) : (
          <PeerLinkFallback recipientAddress={recipientAddress} isMobile={isMobile} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* In-app SDK flow                                                     */
/* ------------------------------------------------------------------ */

function PeerInApp({ onramp }: { onramp: ReturnType<typeof usePeerOnramp> }) {
  const router = useRouter();
  const [platformKey, setPlatformKey] = useState(PEER_PLATFORMS[0].key);
  const [fiat, setFiat] = useState<PeerFiat>("USD");
  const [amount, setAmount] = useState("");

  const platform = PEER_PLATFORMS.find((p) => p.key === platformKey)!;
  const { status, error, quote } = onramp;

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) =>
    setAmount(sanitizeInputValue(e.target.value));

  const onContinue = () => onramp.fetchQuote({ platform, fiat, amount });
  const onConfirm = () => onramp.purchase({ platform, fiat });

  // Status screens after the form.
  if (status === "success") {
    return (
      <div className="space-y-3">
        <Body className="text-sm text-surface-ink font-bold">Payment verified!</Body>
        <Body className="text-sm text-surface-grey-2">
          Your USDC is on its way to your wallet on Base. Bridge it to xDAI on Gnosis to bake into BREAD.
        </Body>
        <div className="lifted-button-container">
          <LiftedButton onClick={() => router.push("/?tab=BRIDGE")}>
            Continue to Bridge →
          </LiftedButton>
        </div>
        <button type="button" onClick={onramp.reset} className="text-xs text-surface-grey hover:underline">
          Buy again
        </button>
      </div>
    );
  }

  if (status === "need_extension") {
    return (
      <StatusBlock
        title="Install the PeerAuth extension"
        body="Peer uses a browser extension to verify your payment privately. Install or connect it, then try again."
        onRetry={onConfirm}
        onCancel={onramp.reset}
      />
    );
  }

  if (status === "signalling") {
    return <StatusBlock title="Confirm in your wallet" body="Approve the transaction to reserve your offer on Base." />;
  }

  if (status === "awaiting_payment") {
    return (
      <StatusBlock
        title={`Pay with ${platform.label}`}
        body={`A ${platform.label} tab has opened. Complete your payment there — we'll verify it automatically. Keep this tab open.`}
      />
    );
  }

  if (status === "verifying") {
    return <StatusBlock title="Verifying your payment" body="This usually takes a few seconds…" />;
  }

  return (
    <div className="space-y-4">
      <Body className="text-sm text-surface-grey-2">
        Buy USDC without KYC directly from another person, paying through your payment app. You&apos;ll receive USDC on Base — bridge it to xDAI on the next step.
      </Body>

      <Selector
        label="Pay with"
        options={PEER_PLATFORMS.map((p) => ({ key: p.key, label: p.label }))}
        value={platformKey}
        onChange={setPlatformKey}
      />
      <Selector
        label="Currency"
        options={PEER_FIATS.map((f) => ({ key: f.code, label: f.code }))}
        value={fiat}
        onChange={(v) => setFiat(v as PeerFiat)}
      />

      <div className="space-y-2">
        <label className="text-sm font-bold text-black">Amount ({fiat})</label>
        <input
          type="text"
          value={amount}
          onChange={handleAmount}
          placeholder="Enter amount"
          className="w-full p-3 border border-surface-grey bg-white text-black placeholder:text-surface-grey-2 focus:outline-none focus:border-[#EA5817]"
        />
      </div>

      {status === "quote_ready" && quote && (
        <div className="bg-paper-main p-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-surface-grey-2">You pay</span>
            <span className="text-surface-ink font-bold">{quote.fiatAmountFormatted} {fiat}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-grey-2">You receive</span>
            <span className="text-surface-ink font-bold">{quote.tokenAmountFormatted} USDC</span>
          </div>
        </div>
      )}

      {error && <Body className="text-sm text-[#e00900]">{error}</Body>}

      <div className="lifted-button-container">
        {status === "quote_ready" ? (
          <LiftedButton onClick={onConfirm}>Confirm &amp; pay</LiftedButton>
        ) : (
          <LiftedButton onClick={onContinue} disabled={status === "quoting" || !amount}>
            {status === "quoting" ? "Getting best offer…" : "Continue"}
          </LiftedButton>
        )}
      </div>
    </div>
  );
}

function Selector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-bold text-black mb-2">{label}</legend>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={value === o.key}
            onClick={() => onChange(o.key)}
            className={clsx(
              "font-bold py-3 px-2 border transition-colors",
              value === o.key
                ? "border-primary-orange text-primary-orange bg-primary-orange/10"
                : "border-surface-grey text-surface-grey bg-paper-main bg-opacity-30",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function StatusBlock({
  title,
  body,
  onRetry,
  onCancel,
}: {
  title: string;
  body: string;
  onRetry?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="space-y-3">
      <Body className="text-sm font-bold text-surface-ink">{title}</Body>
      <Body className="text-sm text-surface-grey-2">{body}</Body>
      {(onRetry || onCancel) && (
        <div className="flex items-center gap-3">
          {onRetry && (
            <button type="button" onClick={onRetry} className="text-sm font-bold text-primary-orange hover:underline">
              Try again
            </button>
          )}
          {onCancel && (
            <button type="button" onClick={onCancel} className="text-sm text-surface-grey hover:underline">
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Link-out fallback (mobile / no wallet)                              */
/* ------------------------------------------------------------------ */

function PeerLinkFallback({ recipientAddress, isMobile }: { recipientAddress?: string; isMobile: boolean }) {
  const handleBuy = () => window.open(buildPeerUrl(), "_blank");
  return (
    <div className="space-y-4">
      <div className="text-surface-grey-2 text-sm">
        <Body className="text-sm mb-3">
          Peer is a peer-to-peer marketplace where you buy crypto without KYC directly from other people, paying through apps like Venmo, Revolut, Wise, Cash App, and Zelle.
        </Body>
        {isMobile && (
          <Body className="text-sm mb-3 text-surface-grey">
            The in-app buy flow needs a desktop browser. On mobile, continue on Peer&apos;s site instead.
          </Body>
        )}
        <div className="mb-3">
          <Body className="text-sm mb-2 font-bold text-surface-ink">How it works:</Body>
          <ol className="text-sm list-decimal list-inside space-y-1">
            <li>Click the button below to open Peer&apos;s trade page and log in</li>
            <li>Select the currency you&apos;re paying with and your payment app to see offers</li>
            <li>Pick an offer to buy USDC (delivered on Base)</li>
            <li>Pay through your payment app — Peer verifies and releases the USDC to your wallet</li>
            <li>Come back and use our Bridge tab to move the USDC from Base into xDAI on Gnosis</li>
          </ol>
        </div>
        {recipientAddress && <WalletAddressHint address={recipientAddress} label="Your wallet address:" />}
      </div>
      <div className="relative lifted-button-container">
        <LiftedButton onClick={handleBuy}>Buy with Peer</LiftedButton>
      </div>
    </div>
  );
}
