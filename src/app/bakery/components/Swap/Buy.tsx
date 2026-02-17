"use client";

import { useState, ChangeEvent } from "react";
import { Body, LiftedButton } from "@breadcoop/ui";
import { sanitizeInputValue } from "@/app/core/util/sanitizeInput";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { usePeerExtension } from "@/app/core/hooks/usePeerExtension";
import { isAddress } from "viem";
import { useIsMobile } from "@/app/core/hooks/useIsMobile";

export function Buy() {
  const [amount, setAmount] = useState("");
  const isMobile = useIsMobile();
  const { user } = useConnectedUser();
  const {
    state,
    isConnecting,
    openInstall,
    requestConnection,
    startOnramp
  } = usePeerExtension();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInputValue(event.target.value);
    setAmount(sanitizedValue);
  };

  const handleBuy = () => {
    if (state === 'needs_install') {
      openInstall();
      return;
    }

    if (state === 'needs_connection') {
      requestConnection();
      return;
    }

    if (state === 'ready') {
      let recipientAddress: string | undefined = undefined;

      if (user.status === "CONNECTED" && isAddress(user.address)) {
        recipientAddress = user.address;
      }

      startOnramp({
        ...(amount && { inputAmount: amount }),
        ...(recipientAddress && { recipientAddress }),
      });
    }
  };

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (state === 'loading') return "Loading...";
    if (state === 'needs_install') return "Install Peer Extension";
    if (state === 'needs_connection') return "Connect Peer Extension";
    if (state === 'ready') return "Buy with Peer";
    return "Extension Not Available";
  };

  const isDisabled = isMobile || state === 'not_available' || state === 'loading' || isConnecting;

  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <div id="peer-description">
          <div className="text-surface-grey-2 text-sm mb-4">
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
            ) : state === 'not_available' ? (
              <>
                <Body className="text-sm mb-3">
                  The Peer browser extension is required to purchase xDAI.
                </Body>
                <Body className="text-sm mb-4">
                  Install the extension to get started with KYC-free crypto purchases using Venmo, Revolut, Wise, Cash App, Zelle, and more.
                </Body>
              </>
            ) : (
              <>
                <Body className="text-sm mb-3">
                  Peer is a service where you can buy crypto without KYC using various neobanking applications.
                </Body>
                <Body className="text-sm mb-3">
                  {state === 'needs_install'
                    ? "Click below to install the Peer extension, then return here to make your purchase."
                    : state === 'needs_connection'
                    ? "Click below to connect the Peer extension to this app."
                    : "Enter the amount of xDAI you would like to purchase and bake into BREAD, then click the button below to continue."}
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
          </div>
        </div>

        {!isMobile && state === 'ready' && (
          <form onSubmit={e => e.preventDefault()} id="peer-form" className="space-y-2">
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
        className={`relative lifted-button-container ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        aria-disabled={isDisabled}
        aria-describedby="peer-description"
      >
        <LiftedButton
          onClick={handleBuy}
          disabled={isDisabled}
          className=""
          form="peer-form"
        >
          {getButtonText()}
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
