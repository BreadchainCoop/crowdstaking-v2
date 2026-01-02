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
              : (
                <>
                  <p className="mb-3">
                    ZKP2P is a service where you can buy crypto without KYC using various neobanking applications.
                  </p>
                  <p className="mb-3">
                    Insert the amount of BREAD you would like to purchase and continue the process by clicking the button below.
                  </p>
                  <p className="mb-3">
                    You will need to download a browser extension called <a href="https://chromewebstore.google.com/detail/peerauth-authenticate-and/ijpgccednehjpeclfcllnjjcmiohdjih" target="_blank" rel="noopener noreferrer" className="text-primary-orange hover:underline">PeerAuth</a> in order to complete your purchase.
                  </p>
                  <p className="mb-4">
                    <a href="#" className="text-primary-orange hover:underline">Learn more about the process →</a>
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-xs font-semibold text-surface-grey">Supported apps:</span>
                    <div className="flex items-center gap-3">
                      <img src="/payment-logos/venmo.svg" alt="Venmo" className="h-6" />
                      <img src="/payment-logos/revolut.svg" alt="Revolut" className="h-6" />
                      <img src="/payment-logos/wise.svg" alt="Wise" className="h-6" />
                      <img src="/payment-logos/cashapp.svg" alt="Cash App" className="h-6" />
                    </div>
                  </div>
                </>
              )
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
