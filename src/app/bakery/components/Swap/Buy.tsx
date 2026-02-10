"use client";

import { useState, ChangeEvent } from "react";
import { Body, LiftedButton } from "@breadcoop/ui";
import { buildPeerUrl } from "@/lib/peer";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { isAddress } from "viem";
import { useStrictMobile } from "@/hooks/use-is-device";

export function Buy() {
  const [amount, setAmount] = useState("");
  const { isMobile } = useStrictMobile();
  const { user } = useConnectedUser();

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

    const url = buildPeerUrl({
      ...(amount && { inputAmount: amount }),
      ...(recipientAddress && { recipientAddress }),
    });
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <div id="peer-description">
          <div className="text-surface-grey-2 text-sm mb-4">
            <>
              <div className="flex items-center gap-3 mb-4">
                <img src="https://www.peer.xyz/logo192.png" alt="Peer" className="h-10 w-10" />
                <Body className="text-base font-bold text-surface-ink">Buy with Peer</Body>
              </div>
              {isMobile ? (
                <>
                  <Body className="text-sm mb-3">
                    This feature is only available on desktop devices.
                  </Body>
                  <Body className="text-sm mb-4">
                    <LearnMoreLink />
                  </Body>
                </>
              ) : (
                <>
                  <Body className="text-sm mb-3">
                    Peer is a service where you can buy crypto without KYC using various neobanking applications.
                  </Body>
                  <Body className="text-sm mb-3">
                    Insert the amount of xDAI you would like to purchase and bake into BREAD, then continue the process by clicking the buy button below.
                  </Body>
                  <Body className="text-sm mb-3">
                    You will need to download a browser extension called <a href="https://chromewebstore.google.com/detail/peerauth-authenticate-and/ijpgccednehjpeclfcllnjjcmiohdjih" target="_blank" rel="noopener noreferrer" className="text-primary-orange hover:underline">PeerAuth</a> in order to complete your purchase.
                  </Body>
                  <Body className="text-sm mb-4">
                    <LearnMoreLink />
                  </Body>
                  <Body className="text-sm flex items-center gap-2 mt-4">
                    <span className="text-xs font-semibold text-surface-grey">Supported apps:</span>
                    <span className="text-xs text-surface-grey-2">Venmo, Revolut, Wise, Cash App, Zelle, N26, and more</span>
                  </Body>
                </>
              )}
            </>
          </div>
        </div>

        {!isMobile && (
          <form onSubmit={e => e.preventDefault} id="peer-form" className="space-y-2">
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

      <div
        className={`relative lifted-button-container ${isMobile ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        aria-disabled={isMobile}
        aria-describedby={isMobile ? "peer-description" : undefined}
      >
        <LiftedButton
          onClick={handleBuy}
          disabled={isMobile}
          className=""
          form="peer-form"
        >
          Buy with Peer
        </LiftedButton>
      </div>
    </div>
  );
}

function LearnMoreLink() {
	return (
		<a
			href="https://docs.peer.xyz/guides/for-buyers/complete-guide-to-onboarding"
			className="text-primary-orange hover:underline"
			target="_blank"
			rel="noopener noreferrer"
		>
			Learn more about the process →
		</a>
	);
}
