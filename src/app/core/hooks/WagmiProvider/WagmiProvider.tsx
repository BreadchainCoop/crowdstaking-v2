import type { ReactNode } from "react";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import { chains, config } from "./config/testConfig";

const baseTheme = darkTheme({
  accentColor: "#E873D3",
  accentColorForeground: "#2E2E2E",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    modalBackground: "#242424",
  },
  fonts: {
    body: "var(--font-redhat)",
  },
};

// export function WagmiProvider({ children }: { children: ReactNode }) {
//   return (
//     <WagmiConfig config={config}>
//       <RainbowKitProvider modalSize="compact" theme={theme} chains={chains}>
//         {children}
//       </RainbowKitProvider>
//     </WagmiConfig>
//   );
// }
