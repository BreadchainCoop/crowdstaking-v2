import { WidgetConfig } from "@lifi/widget";

export const lifiConfig: Partial<WidgetConfig> = {
  variant: "compact",
  subvariant: "default",
  appearance: "light",
  chains: {
    allow: [1, 100, 42161, 8453, 56],
  },
  // initialize to xDai on Gnosis chain
  toToken: "0x0000000000000000000000000000000000000000",
  toChain: 100,
  disabledUI: ["toToken"],
  theme: {
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: "#ea5816"
          },
          secondary: {
            main: "#F7C2FF"
          },
          info: {
            main: "#ea5816"
          },
          background: {
            default: "#fefaf3",
            paper: "#f0ebe0"
          },
          text: {
            secondary: "#595959"
          },
          success: {
            main: "#31a800"
          },
          error: {
            main: "#e00900"
          },
          common: {
            white: "#f7f3eb"
          },
          grey: {
            200: "#808080",
            300: "#ebe2d6",
            700: "#595959",
            800: "#6d6d6d"
          }
        }
      },
      dark: {
        palette: {
          primary: {
            main: "#5C67FF"
          },
          secondary: {
            main: "#F7C2FF"
          }
        }
      }
    },
    typography: {
      fontFamily: "Inter, sans-serif"
    },
    container: {
      boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
      borderRadius: "1rem",
    },
    shape: {
      borderRadius: 0,
      borderRadiusSecondary: 0
    }
  }
}
