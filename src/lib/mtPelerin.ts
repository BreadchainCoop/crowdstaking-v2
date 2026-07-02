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
    _ctkn: mtPelerinConfig.activationKey ?? "",
    type: "direct-link",
    tab: "buy",
    tabs: "buy",
    net: mtPelerinConfig.network,
    nets: mtPelerinConfig.network,
    bdc: mtPelerinConfig.defaultCrypto,
    bsc: mtPelerinConfig.defaultFiat,
  });

  if (options?.inputAmount) {
    params.set("bsa", options.inputAmount);
  }

  if (options?.recipientAddress) {
    params.set("addr", options.recipientAddress);
  }

  return `${mtPelerinConfig.baseUrl}?${params.toString()}`;
}
