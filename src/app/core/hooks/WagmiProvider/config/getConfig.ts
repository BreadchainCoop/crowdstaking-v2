export function getConfig() {
  if (process.env.NODE_ENV !== "production") {
    const { devConfig, devIframeConfig } = require("./devConfig");
    return { config: devConfig, iframeConfig: devIframeConfig };
  }

  const { prodConfig, prodIframeConfig } = require("./prodConfig");
  return { config: prodConfig, iframeConfig: prodIframeConfig };
}
