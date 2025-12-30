"use client";

import { useState, ChangeEvent } from "react";
import { Body, LiftedButton } from "@breadcoop/ui";
import { buildZkp2pUrl } from "@/lib/zkp2p";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { Desktop, DeviceMobile } from "@phosphor-icons/react";

export function Buy() {
  const [amount, setAmount] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInputValue(event.target.value);
    setAmount(sanitizedValue);
  };

  const handleBuy = () => {
    const url = buildZkp2pUrl(amount ? { inputAmount: amount } : undefined);
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <Body className="text-surface-grey-2 text-sm mb-4">
          Buy xDAI with Venmo, Revolut, Wise, or Cash App via ZKP2P.
          You&apos;ll be redirected to complete your purchase.
        </Body>

        <div className="flex items-center gap-2 mb-4">
          <Desktop size={20} className="text-surface-grey" />
          <Body className="text-surface-grey text-xs">
            Desktop only - this feature is not available on mobile devices.
          </Body>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-black">
            Amount (USD) - Optional
          </label>
          <input
            type="text"
            value={amount}
            onChange={handleInputChange}
            placeholder="Enter amount or leave blank"
            className="w-full p-3 border border-surface-grey bg-white text-black placeholder:text-surface-grey-2 focus:outline-none focus:border-[#EA5817]"
          />
        </div>
      </div>

      <div className="relative lifted-button-container">
        <LiftedButton onClick={handleBuy}>Buy with ZKP2P</LiftedButton>
      </div>
    </div>
  );
}
