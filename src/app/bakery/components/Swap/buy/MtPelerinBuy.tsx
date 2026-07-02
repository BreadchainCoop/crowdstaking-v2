"use client";

import { ChangeEvent } from "react";
import { Body } from "@breadcoop/ui";
import { buildMtPelerinUrl, hasMtPelerinKey } from "@/lib/mtPelerin";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { WalletAddressHint } from "./WalletAddressHint";
import { BuyCard } from "./BuyCard";
import { ProviderHeader } from "./ProviderHeader";
import { HowItWorksDropdown } from "./HowItWorksDropdown";

const MT_PELERIN_LOGO_SRC = "https://www.mtpelerin.com/icons/android-chrome-192x192.png";
const MT_PELERIN_FORM_ID = "mtpelerin-form";

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
    <BuyCard
      buttonLabel="Buy with Mt Pelerin"
      onBuy={handleBuy}
      formId={hasMtPelerinKey ? MT_PELERIN_FORM_ID : undefined}
      extra={
        hasMtPelerinKey && (
          <form onSubmit={e => e.preventDefault()} id={MT_PELERIN_FORM_ID} className="space-y-2">
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
        )
      }
    >
      <ProviderHeader logoSrc={MT_PELERIN_LOGO_SRC} name="Mt Pelerin" />
      <Body className="text-sm mb-3">
        Mt Pelerin is a Swiss service for buying xDAI directly on Gnosis Chain. Bank transfers (SEPA, Swiss) <span className="font-bold text-surface-ink">need no ID verification up to roughly 1,000 CHF/EUR per month</span> &mdash; just an email and phone number. Card purchases and larger amounts require identity verification.
      </Body>
      <Body className="text-sm mb-3">
        Not available to US residents &mdash; use Peer instead.
      </Body>
      {hasMtPelerinKey ? (
        <Body className="text-sm mb-3">
          Insert the amount of xDAI you would like to purchase and bake into BREAD, then continue the process by clicking the buy button below.
        </Body>
      ) : (
        <HowItWorksDropdown
          steps={[
            "Click the button below to open Mt Pelerin's xDAI page",
            "Choose the amount you want to buy",
            "Enter your wallet address as the receiving address",
            "Pay by bank transfer, or by card if you verify your identity — your xDAI arrives in your wallet, ready to bake into BREAD",
          ]}
        />
      )}
      {!hasMtPelerinKey && recipientAddress && (
        <WalletAddressHint address={recipientAddress} label="Your wallet address (for step 3):" />
      )}
      <Body className="text-xs text-surface-grey mt-3">
        Note: receiving your crypto can take a few minutes to a few hours, depending on the payment method.
      </Body>
    </BuyCard>
  );
}
