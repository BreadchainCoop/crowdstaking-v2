"use client";

import { PrivyProvider as ExProvider, PrivyClientConfig, WalletListEntry } from "@privy-io/react-auth";
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
			{children}
		</ExProvider>
	);
}
