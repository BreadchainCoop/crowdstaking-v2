"use client";
import { useEffect, useRef } from "react";
import { Address, encodeFunctionData, Hex } from "viem";
import { usePublicClient } from "wagmi";

import { BREAD_ABI } from "@/abi";
import { BREAD_ADDRESS } from "@/constants";
import { publicConfig } from "./WagmiProvider/config/publicConfig";
import { useSponsoredTx } from "./useSponsoredTx";

const GNOSIS_CHAIN_ID = 100;

/**
 * Watches an embedded wallet for incoming xDAI and immediately bakes it into
 * BREAD — gas-sponsored, with no wallet UI. This is what makes a deposit
 * "auto-bake" with zero extra steps: the user funds the wallet with xDAI
 * (card / exchange / transfer via Privy's on-ramp) and the moment it lands,
 * the freshly-received amount is minted to BREAD.
 *
 * Pass `address: undefined` to disable the watcher (e.g. when no deposit is in
 * progress) so we aren't polling every block app-wide.
 *
 * @param address  Embedded wallet to watch (the receiver of the BREAD).
 * @param onFunded Fires after a successful auto-bake, with the new/old balances.
 */
export function useWatchFundedXdai(
	address: Address | undefined,
	onFunded?: (newBalance: bigint, prevBalance: bigint) => Promise<void> | void
) {
	const publicClient = usePublicClient({
		config: publicConfig,
		chainId: GNOSIS_CHAIN_ID,
	});
	const prevBalance = useRef<bigint>(BigInt(0));
	const isMinting = useRef(false);
	const { sendSponsoredTransaction } = useSponsoredTx();

	useEffect(() => {
		if (!address || !publicClient) return;

		publicClient.getBalance({ address }).then((bal) => {
			prevBalance.current = bal;
		});

		const unwatch = publicClient.watchBlocks({
			onBlock: async () => {
				if (isMinting.current) return;

				const balance = await publicClient.getBalance({ address });
				if (!(balance > prevBalance.current)) return;

				isMinting.current = true;
				const received = balance - prevBalance.current;
				try {
					const data = encodeFunctionData({
						abi: BREAD_ABI,
						functionName: "mint",
						args: [address],
					});
					const { hash } = await sendSponsoredTransaction(
						{ to: BREAD_ADDRESS as Address, data, value: received },
						{ uiOptions: { showWalletUIs: false } }
					);
					await publicClient.waitForTransactionReceipt({
						hash: hash as Hex,
					});
					await onFunded?.(balance, prevBalance.current);
				} finally {
					isMinting.current = false;
					prevBalance.current = balance;
				}
			},
		});

		return unwatch;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, publicClient]);
}
