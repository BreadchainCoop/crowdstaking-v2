export const peerConfig = {
  // Peer (formerly ZKP2P) deprecated their deeplink/redirect onramp as of
  // extension 0.6.0 — URL params like toToken, inputAmount, recipientAddress
  // and callbackUrl are ignored, and Gnosis Chain is no longer a supported
  // destination (buyers receive USDC on Base/Arbitrum/etc.). We link to the
  // marketplace and guide the user from our side; bridging back to Gnosis
  // is covered by the Bridge tab.
  marketplaceUrl: "https://peer.xyz/",
};

export function buildPeerUrl(): string {
  return peerConfig.marketplaceUrl;
}
