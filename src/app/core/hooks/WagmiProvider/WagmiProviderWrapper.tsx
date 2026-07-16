"use client";
import { useEffect, useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "@wagmi/core/query";
import type { ConnectedWallet, User } from "@privy-io/react-auth";

import { privyWagmiConfig } from "./config/privyConfig";
import { publicConfig } from "./config/publicConfig";

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
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	// @privy-io/wagmi's WagmiProvider is not safe during static prerender (it
	// reads Privy refs that don't exist server-side). So use it only on the
	// client, after mount. During SSR/prerender — and when Privy isn't
	// configured (e.g. CI without the env var) — fall back to plain, read-only
	// wagmi so every page prerenders cleanly. First client render also uses the
	// fallback (mounted === false), matching the server output, then swaps to
	// the embedded-wallet provider once mounted (no hydration mismatch).
	if (PRIVY_ENABLED && mounted) {
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

	return (
		<WagmiProvider config={publicConfig}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}
