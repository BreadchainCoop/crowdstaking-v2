"use client";
import { useCallback, useEffect, useState } from "react";
import {
	Address,
	createWalletClient,
	custom,
	encodeFunctionData,
	EIP1193Provider,
	Hex,
	parseEther,
} from "viem";
import { gnosis } from "viem/chains";
import { usePublicClient } from "wagmi";

import { BREAD_ABI } from "@/abi";
import { BREAD_ADDRESS } from "@/constants";
import { publicConfig } from "@/app/core/hooks/WagmiProvider/config/publicConfig";
import { useAutoBakeBread } from "@/app/core/hooks/useAutoBakeBread";

export type FundAsset = "xdai" | "bread";

/**
 * Fund the embedded wallet from the user's own browser-injected wallet
 * (MetaMask etc.), mirroring app-stacks' "fund from connected wallet" option:
 *  - xDAI  -> send xDAI to the embedded wallet, then sponsor-bake it into BREAD
 *  - BREAD -> ERC20-transfer BREAD straight to the embedded wallet (no bake)
 *
 * The injected wallet is used purely as a funding source; the embedded wallet
 * remains the user's primary account.
 */
export function useFundFromConnectedWallet(receiver?: Address) {
	const [externalAccount, setExternalAccount] = useState<Address>();
	const publicClient = usePublicClient({
		config: publicConfig,
		chainId: gnosis.id,
	});
	const { autoBakeBread } = useAutoBakeBread();

	const getInjected = useCallback(() => {
		if (typeof window === "undefined") return undefined;
		const provider = (window as unknown as { ethereum?: EIP1193Provider })
			.ethereum;
		if (!provider) return undefined;
		return createWalletClient({ chain: gnosis, transport: custom(provider) });
	}, []);

	// Detect the injected account (read-only) so we can show its balance.
	useEffect(() => {
		const client = getInjected();
		if (!client) return;
		client
			.requestAddresses()
			.then(([account]) => account && setExternalAccount(account))
			.catch(() => undefined);
	}, [getInjected]);

	const fund = useCallback(
		async (asset: FundAsset, amount: string) => {
			if (!receiver) throw new Error("No embedded wallet to fund");
			const client = getInjected();
			if (!client) throw new Error("No browser wallet detected");

			const [account] = await client.requestAddresses();
			if (!account) throw new Error("Wallet connection rejected");

			if ((await client.getChainId()) !== gnosis.id) {
				await client.switchChain({ id: gnosis.id });
			}

			const value = parseEther(amount);
			let hash: Hex;

			if (asset === "xdai") {
				hash = await client.sendTransaction({
					account,
					to: receiver,
					value,
					chain: gnosis,
				});
				await publicClient?.waitForTransactionReceipt({ hash });
				// Bake the freshly-received xDAI into BREAD (gas-sponsored).
				await autoBakeBread({ receiver, amount: value });
			} else {
				hash = await client.sendTransaction({
					account,
					to: BREAD_ADDRESS as Address,
					data: encodeFunctionData({
						abi: BREAD_ABI,
						functionName: "transfer",
						args: [receiver, value],
					}),
					chain: gnosis,
				});
				await publicClient?.waitForTransactionReceipt({ hash });
			}

			return hash;
		},
		[receiver, getInjected, publicClient, autoBakeBread]
	);

	return { externalAccount, fund };
}
