"use client";

import { ChangeEvent, useState } from "react";
import { Body, LiftedButton } from "@breadcoop/ui";
import { buildMtPelerinUrl, hasMtPelerinKey } from "@/lib/mtPelerin";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";

export function MtPelerinBuy({
  amount,
  onAmountChange,
  recipientAddress,
}: {
  amount: string;
  onAmountChange: (amount: string) => void;
  recipientAddress?: string;
}) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAmountChange(sanitizeInputValue(event.target.value));
  };

  const handleBuy = () => {
    const url = buildMtPelerinUrl({
      ...(amount && { inputAmount: amount }),
      ...(recipientAddress && { recipientAddress }),
    });
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <div className="text-surface-grey-2 text-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <img src="https://www.mtpelerin.com/icons/android-chrome-192x192.png" alt="Mt Pelerin" className="h-10 w-10" />
            <Body className="text-base font-bold text-surface-ink">Buy with Mt Pelerin</Body>
          </div>
          <Body className="text-sm mb-3">
            Mt Pelerin is a Swiss service for buying xDAI directly on Gnosis Chain. Bank transfers (SEPA, Swiss) need no ID verification up to roughly 1,000 CHF/EUR per month &mdash; just an email and phone number. Card purchases and larger amounts require identity verification.
          </Body>
          <Body className="text-sm mb-3">
            Not available to US residents &mdash; use Peer instead.
          </Body>
          {hasMtPelerinKey ? (
            <Body className="text-sm mb-3">
              Insert the amount of xDAI you would like to purchase and bake into BREAD, then continue the process by clicking the buy button below.
            </Body>
          ) : (
            <div className="mb-3">
              <Body className="text-sm mb-2 font-bold text-surface-ink">How it works:</Body>
              <ol className="text-sm list-decimal list-inside space-y-1">
                <li>Click the button below to open Mt Pelerin&apos;s xDAI page</li>
                <li>Choose the amount you want to buy</li>
                <li>Enter your wallet address as the receiving address</li>
                <li>Pay by bank transfer &mdash; your xDAI arrives in your wallet, ready to bake into BREAD</li>
              </ol>
            </div>
          )}
          {!hasMtPelerinKey && recipientAddress && (
            <WalletAddressHint address={recipientAddress} />
          )}
        </div>

        {hasMtPelerinKey && (
          <form onSubmit={e => e.preventDefault()} id="mtpelerin-form" className="space-y-2">
            <label className="text-sm font-bold text-black">
              Amount (USD) - Optional
            </label>
            <input
              type="text"
              value={amount}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              placeholder="Enter amount or leave blank"
              className="w-full p-3 border border-surface-grey bg-white text-black placeholder:text-surface-grey-2 focus:outline-none focus:border-[#EA5817]"
            />
          </form>
        )}
      </div>

      <div className="relative lifted-button-container">
        <LiftedButton onClick={handleBuy} className="" form={hasMtPelerinKey ? "mtpelerin-form" : undefined}>
          Buy with Mt Pelerin
        </LiftedButton>
      </div>
    </div>
  );
}

function WalletAddressHint({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — user can select the text manually
    }
  };

  return (
    <div className="bg-paper-main p-3 mt-3">
      <Body className="text-xs font-semibold text-surface-grey mb-1">
        Your wallet address (for step 3):
      </Body>
      <div className="flex items-center gap-2">
        <code className="text-xs text-surface-ink break-all">{address}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-bold text-primary-orange hover:underline shrink-0"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
