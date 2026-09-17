"use client";
import { Address, encodeFunctionData, Hex } from "viem";
import { usePublicClient } from "wagmi";

import { BREAD_ABI } from "@/abi";
import { BREAD_ADDRESS } from "@/constants";
import { publicConfig } from "./WagmiProvider/config/publicConfig";
import { useSponsoredTx } from "./useSponsoredTx";

const GNOSIS_CHAIN_ID = 100;

/**
 * Bakes BREAD by calling the payable `mint(receiver)` with xDAI as `value`
 * (1 xDAI -> 1 BREAD), via a gas-sponsored embedded-wallet transaction with no
 * wallet UI. This is the same primitive the bake page uses, but signed and
 * sponsored by Privy so it can run with zero user interaction.
 */
export function useAutoBakeBread() {
	const { sendSponsoredTransaction } = useSponsoredTx();
	const publicClient = usePublicClient({
		config: publicConfig,
		chainId: GNOSIS_CHAIN_ID,
	});

	const autoBakeBread = async ({
		receiver,
		amount,
	}: {
		receiver: Address;
		amount: bigint;
	}) => {
		if (amount <= BigInt(0)) return;

		const data = encodeFunctionData({
			abi: BREAD_ABI,
			functionName: "mint",
			args: [receiver],
		});

		const { hash } = await sendSponsoredTransaction(
			{ to: BREAD_ADDRESS as Address, data, value: amount },
			{ uiOptions: { showWalletUIs: false } }
		);

		await publicClient?.waitForTransactionReceipt({ hash: hash as Hex });

		return hash;
	};

	return { autoBakeBread };
}
