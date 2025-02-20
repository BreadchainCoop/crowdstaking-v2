import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http, createConfig } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, Chain } from "wagmi/chains";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const foundry: Chain = {
  id: 31_337,
  name: "Foundry",
  network: "foundry",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"],
    },
    public: {
      http: ["http://localhost:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Local", url: "" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{/* Your App */}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const config = createConfig({
  chains: [foundry, mainnet, sepolia],
  transports: {
    [foundry.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  queryClient: queryClient,
});
