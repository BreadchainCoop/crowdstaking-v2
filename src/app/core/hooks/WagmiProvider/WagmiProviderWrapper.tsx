import type { ReactNode } from "react";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "@wagmi/core/query";
import type { ConnectedWallet, User } from "@privy-io/react-auth";

import { privyWagmiConfig } from "./config/privyConfig";

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
 * reflects it. Linked external wallets are only used as funding sources inside
 * the fund module, never as the primary account.
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
	return (
		<WagmiProvider
			config={privyWagmiConfig}
			setActiveWalletForWagmi={preferEmbeddedWallet}
		>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}
