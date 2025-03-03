export function getConfig() {
  if (process.env.NODE_ENV !== "production") {
    const { devConfig, devChains } = require("./devConfig");
    return { chains: devChains, config: devConfig };
  }

  const { prodConfig, prodChains } = require("./prodConfig");
  return { chains: prodChains, config: prodConfig };
}
