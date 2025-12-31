export const zkp2pConfig = {
  baseUrl: "https://zkp2p.xyz/swap",
  referrer: "Bread Crowdstaking",
  referrerLogo: "https://fund.bread.coop/logo.svg",
  // xDAI on Gnosis Chain (chainId: 100, native token)
  toToken: "100:0x0000000000000000000000000000000000000000",
};

export function buildZkp2pUrl(options?: { inputAmount?: string; recipientAddress?: string }): string {
  const params = new URLSearchParams({
    referrer: zkp2pConfig.referrer,
    referrerLogo: zkp2pConfig.referrerLogo,
    toToken: zkp2pConfig.toToken,
    callbackUrl: `${window.location.origin}/bakery?zkp2p=success`,
  });

  if (options?.inputAmount) {
    params.set("inputAmount", options.inputAmount);
  }

  if (options?.recipientAddress) {
    params.set("recipientAddress", options.recipientAddress);
  }

  return `${zkp2pConfig.baseUrl}?${params.toString()}`;
}
