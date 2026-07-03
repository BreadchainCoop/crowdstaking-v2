"use client";

import { Body, LiftedButton } from "@breadcoop/ui";
import { buildPeerUrl } from "@/lib/peer";
import { WalletAddressHint } from "./WalletAddressHint";

export function PeerBuy({ recipientAddress }: { recipientAddress?: string }) {
  const handleBuy = () => {
    window.open(buildPeerUrl(), "_blank");
  };

  return (
    <div className="space-y-4">
      <div className="bg-paper-1 p-5">
        <div className="text-surface-grey-2 text-sm mb-4">
          <div className="flex items-center gap-3 mb-4">
            <img src="https://www.peer.xyz/logo192.png" alt="Peer" className="h-10 w-10" />
            <Body className="text-base font-bold text-surface-ink">Buy with Peer</Body>
          </div>
          <Body className="text-sm mb-3">
            Peer is a peer-to-peer marketplace where you buy crypto without KYC directly from other people, paying through apps like Venmo, Revolut, Wise, Cash App, Zelle, and N26.
          </Body>
          <div className="mb-3">
            <Body className="text-sm mb-2 font-bold text-surface-ink">How it works:</Body>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li>Click the button below to open Peer&apos;s trade page and log in with a wallet or social account</li>
              <li>Select the currency you&apos;re paying with and your payment app to see the available offers</li>
              <li>Pick an offer from the list to buy USDC (choose Base as the network)</li>
              <li>Pay through your payment app &mdash; Peer verifies the payment automatically and releases the USDC to your wallet</li>
              <li>Come back and use our Bridge tab to swap the USDC into xDAI on Gnosis, ready to bake into BREAD</li>
            </ol>
          </div>
          <Body className="text-sm mb-4">
            <LearnMoreLink />
          </Body>
          {recipientAddress && (
            <WalletAddressHint address={recipientAddress} label="Your wallet address:" />
          )}
        </div>
      </div>

      <div className="relative lifted-button-container">
        <LiftedButton onClick={handleBuy} className="">
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
