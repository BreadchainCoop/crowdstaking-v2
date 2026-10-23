"use client";

import { PrivyProvider as ExProvider, PrivyClientConfig, WalletListEntry, usePrivy } from "@privy-io/react-auth";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { gnosis } from "viem/chains";

const walletList: WalletListEntry[] = [
  "metamask",
  "coinbase_wallet",
  "rainbow",
  "detected_ethereum_wallets",
  "wallet_connect",
  "wallet_connect_qr"
];

const privyConfig: PrivyClientConfig = {
  defaultChain: gnosis,
  supportedChains: [gnosis],
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
  },
  walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  appearance: {
    walletList,
  },
}

export default function PrivyProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ExProvider
			appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
			clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID as string}
			config={privyConfig}
		>
			<PostHogIdentity />
			{children}
		</ExProvider>
	);
}

function PostHogIdentity() {
	const { ready, authenticated, user } = usePrivy();
	const identifiedUserId = useRef<string | null>(null);
	const wasAuthenticated = useRef(authenticated);

	useEffect(() => {
		if (!ready) return;

		const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
		const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
		if (!projectToken || !host) return;

		if (authenticated && user?.id) {
			if (identifiedUserId.current && identifiedUserId.current !== user.id) {
				posthog.reset();
			}

			if (identifiedUserId.current !== user.id) {
				posthog.identify(user.id);
				identifiedUserId.current = user.id;
			}

			if (!wasAuthenticated.current) {
				posthog.capture("sign_in_completed");
			}
			wasAuthenticated.current = true;
			return;
		}

		wasAuthenticated.current = false;
		if (identifiedUserId.current) {
			posthog.reset();
			identifiedUserId.current = null;
		}
	}, [authenticated, ready, user?.id]);

	return null;
}
