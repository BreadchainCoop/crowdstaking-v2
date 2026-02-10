export const peerConfig = {
  baseUrl: "https://peer.xyz/swap",
  referrer: "Bread Crowdstaking",
  referrerLogo: "https://fund.bread.coop/logo.svg",
  // xDAI on Gnosis Chain (chainId: 100, native token)
  toToken: "100:0x0000000000000000000000000000000000000000",
};

export function buildPeerUrl(options?: { inputAmount?: string; recipientAddress?: string }): string {
  const params = new URLSearchParams({
    referrer: peerConfig.referrer,
    referrerLogo: peerConfig.referrerLogo,
    toToken: peerConfig.toToken,
    callbackUrl: `${window.location.origin}/?peer=success`,
  });

  if (options?.inputAmount) {
    params.set("inputAmount", options.inputAmount);
  }

  if (options?.recipientAddress) {
    params.set("recipientAddress", options.recipientAddress);
  }

  return `${peerConfig.baseUrl}?${params.toString()}`;
}
