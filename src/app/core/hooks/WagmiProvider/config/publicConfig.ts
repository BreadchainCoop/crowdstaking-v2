import { createConfig, fallback, http } from "wagmi";
import { gnosis, foundry, sepolia } from "wagmi/chains";
import { publicRpcUrls } from "./utils";

const _rpcs = [...publicRpcUrls].map((rpc) =>
	http(rpc, { timeout: 7_000, retryCount: 1 }),
);

// no paid RPCs here. useful for hooks that read frequent data (block number)
const publicConfig = createConfig({
	chains: [gnosis, foundry, sepolia],
	transports: {
		[gnosis.id]: fallback(_rpcs),
		[foundry.id]: http("http://localhost:8545"),
		[sepolia.id]: http(),
	},
});

export { publicConfig };
