"use client";

import { Body } from "@breadcoop/ui";
import { buildPeerUrl } from "@/lib/peer";
import { WalletAddressHint } from "./WalletAddressHint";
import { BuyCard } from "./BuyCard";
import { ProviderHeader } from "./ProviderHeader";
import { HowItWorksDropdown } from "./HowItWorksDropdown";

const PEER_LOGO_SRC = "https://www.peer.xyz/logo192.png";

export function PeerBuy({ recipientAddress }: { recipientAddress?: string }) {
  const handleBuy = () => {
    window.open(buildPeerUrl(), "_blank");
  };

  return (
    <BuyCard buttonLabel="Buy with Peer" onBuy={handleBuy}>
      <ProviderHeader logoSrc={PEER_LOGO_SRC} name="Peer" />
      <Body className="text-sm mb-3">
        Peer is a peer-to-peer marketplace where you buy crypto without KYC directly from other people, paying through apps like Venmo, Revolut, Wise, Cash App, and Zelle.
      </Body>
      <HowItWorksDropdown
        steps={[
          "Click the button below to open Peer's trade page and log in with a wallet or social account",
          "Select the currency you're paying with and your payment app to see the available offers",
          "Pick an offer from the list to buy USDC (delivered on Base)",
          "Pay through your payment app — Peer verifies the payment automatically and releases the USDC to your wallet",
          "Come back and use our Bridge tab to move the USDC from Base into xDAI on Gnosis, ready to bake into BREAD",
        ]}
      />
      {recipientAddress && (
        <WalletAddressHint address={recipientAddress} label="Your wallet address:" />
      )}
    </BuyCard>
  );
}
