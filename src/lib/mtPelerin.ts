export const mtPelerinConfig = {
  baseUrl: "https://widget.mtpelerin.com/",
  // Mt Pelerin's public consumer page — works without a partner key,
  // but can't pre-fill wallet address or amount.
  consumerBuyUrl: "https://www.mtpelerin.com/buy-xdai",
  activationKey: process.env.NEXT_PUBLIC_MTPELERIN_ACTIVATION_KEY,
  // xDAI on Gnosis Chain
  network: "xdai_mainnet",
  defaultCrypto: "XDAI",
  defaultFiat: "USD",
};

// The parameterized widget deep-link requires a partner activation key
// (_ctkn, requested via hello@mtpelerin.com). Without one we fall back
// to the consumer buy page.
export const hasMtPelerinKey = Boolean(mtPelerinConfig.activationKey);

export function buildMtPelerinUrl(options?: { inputAmount?: string; recipientAddress?: string }): string {
  if (!hasMtPelerinKey) {
    return mtPelerinConfig.consumerBuyUrl;
  }

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
