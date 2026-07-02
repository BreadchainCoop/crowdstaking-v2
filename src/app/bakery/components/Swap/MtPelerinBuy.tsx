"use client";

import { ChangeEvent } from "react";
import { Body, LiftedButton } from "@breadcoop/ui";
import { buildMtPelerinUrl } from "@/lib/mtPelerin";
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
            <img src="https://www.mtpelerin.com/favicon.ico" alt="Mt Pelerin" className="h-10 w-10" />
            <Body className="text-base font-bold text-surface-ink">Buy with Mt Pelerin</Body>
          </div>
          <Body className="text-sm mb-3">
            Mt Pelerin is a Swiss fiat-to-crypto service that buys xDAI directly on Gnosis Chain. No ID is required for card purchases up to roughly 5,000 CHF/EUR/GBP, or bank transfers under CHF 100,000.
          </Body>
          <Body className="text-sm mb-3">
            Insert the amount of xDAI you would like to purchase and bake into BREAD, then continue the process by clicking the buy button below.
          </Body>
          <Body className="text-sm mb-4">
            Your purchase completes on Mt Pelerin&apos;s site &mdash; once done, your xDAI should arrive in your wallet shortly.
          </Body>
        </div>

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
      </div>

      <div className="relative lifted-button-container">
        <LiftedButton onClick={handleBuy} className="" form="mtpelerin-form">
          Buy with Mt Pelerin
        </LiftedButton>
      </div>
    </div>
  );
}
