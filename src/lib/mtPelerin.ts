export const mtPelerinConfig = {
  baseUrl: "https://widget.mtpelerin.com/",
  activationKey: process.env.NEXT_PUBLIC_MTPELERIN_ACTIVATION_KEY,
  // xDAI on Gnosis Chain
  network: "xdai_mainnet",
  defaultCrypto: "XDAI",
  defaultFiat: "USD",
};

export function buildMtPelerinUrl(options?: { inputAmount?: string; recipientAddress?: string }): string {
  const params = new URLSearchParams({
    type: "direct-link",
    tab: "buy",
    tabs: "buy",
    net: mtPelerinConfig.network,
    nets: mtPelerinConfig.network,
    bdc: mtPelerinConfig.defaultCrypto,
    bsc: mtPelerinConfig.defaultFiat,
  });

  // Partner activation key (requested via hello@mtpelerin.com). The widget
  // currently works without one, but only a keyed integration is documented
  // and gets referral attribution.
  if (mtPelerinConfig.activationKey) {
    params.set("_ctkn", mtPelerinConfig.activationKey);
  }

  if (options?.inputAmount) {
    params.set("bsa", options.inputAmount);
  }

  if (options?.recipientAddress) {
    params.set("addr", options.recipientAddress);
  }

  return `${mtPelerinConfig.baseUrl}?${params.toString()}`;
}
