"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Body, LiftedButton } from "@breadcoop/ui";
import { buildZkp2pUrl } from "@/lib/zkp2p";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { Desktop } from "@phosphor-icons/react";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { isAddress } from "viem";

export function Buy() {
  const [amount, setAmount] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useConnectedUser();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInputValue(event.target.value);
    setAmount(sanitizedValue);
  };

  const handleBuy = () => {
    let recipientAddress: string | undefined = undefined;

    // Validate and use recipient address only if user is connected and address is valid
    if (user.status === "CONNECTED" && isAddress(user.address)) {
      recipientAddress = user.address;
    }

    const url = buildZkp2pUrl({
      ...(amount && { inputAmount: amount }),
      ...(recipientAddress && { recipientAddress }),
    });
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <div id="zkp2p-description">
          <Body className="text-surface-grey-2 text-sm mb-4">
            {isMobile
              ? "This feature is only available on desktop devices."
              : "Clicking the button below will take you to the ZKP2P website where you can complete your purchase using Venmo, Revolut, Wise, or Cash App."
            }
          </Body>
        </div>

        {isMobile && (
          <div className="flex items-center gap-2 mb-4" role="alert" aria-live="polite">
            <Desktop size={20} className="text-surface-grey" aria-hidden="true" />
            <Body className="text-surface-grey text-xs">
              Desktop only - this feature is not available on mobile devices.
            </Body>
          </div>
        )}

        {!isMobile && (
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
        )}
      </div>

      <div
        className={`relative lifted-button-container ${isMobile ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        aria-disabled={isMobile}
        aria-describedby={isMobile ? "zkp2p-description" : undefined}
      >
        <LiftedButton
          onClick={handleBuy}
          disabled={isMobile}
          className=""
        >
          Buy with ZKP2P
        </LiftedButton>
      </div>
    </div>
  );
}
