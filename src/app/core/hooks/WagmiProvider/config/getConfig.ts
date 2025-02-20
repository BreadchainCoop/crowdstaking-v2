export function getConfig() {
  if (process.env.NODE_ENV !== "production") {
  }

  const { prodConfig, prodChains } = require("./prodConfig");
  return { chains: prodChains, config: prodConfig };
}
