import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "@wagmi/core/query";
import type { ConnectedWallet, User } from "@privy-io/react-auth";

import { privyWagmiConfig } from "./config/privyConfig";
import { publicConfig } from "./config/publicConfig";

// Build-time constant: stable across SSR/CSR, no hydration mismatch.
const PRIVY_ENABLED = Boolean(process.env.NEXT_PUBLIC_PRIVY_APP_ID);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: hashFn,
		},
	},
});

/**
 * Make the Privy *embedded* wallet the active wagmi account whenever it exists,
 * so `useAccount()` — and therefore the whole app (nav, balances, governance) —
 * reflects it. Linked external wallets are only funding sources in the fund
 * module, never the primary account.
 */
function preferEmbeddedWallet({
	wallets,
}: {
	wallets: ConnectedWallet[];
	user: User | null;
}): ConnectedWallet | undefined {
	return (
		wallets.find((wallet) => wallet.walletClientType === "privy") ??
		wallets[0]
	);
}

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
	// With Privy configured, the embedded wallet is the active account via
	// @privy-io/wagmi. Its WagmiProvider needs a PrivyProvider ancestor (added
	// by AppProvider under the same flag) and a QueryClient ancestor.
	if (PRIVY_ENABLED) {
		return (
			<QueryClientProvider client={queryClient}>
				<PrivyWagmiProvider
					config={privyWagmiConfig}
					setActiveWalletForWagmi={preferEmbeddedWallet}
				>
					{children}
				</PrivyWagmiProvider>
			</QueryClientProvider>
		);
	}

	// Fallback for environments without the Privy app id (e.g. CI "Next Build"
	// which lacks the Netlify env var): plain, read-only wagmi so prerendering
	// succeeds without a Privy context. Real deploys set the env and use the
	// embedded-wallet path above.
	return (
		<WagmiProvider config={publicConfig}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}
