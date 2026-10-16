"use client";
import { useSendTransaction } from "@privy-io/react-auth";

const GNOSIS_CHAIN_ID = 100;

/**
 * Wraps Privy's embedded-wallet `sendTransaction` so transactions on Gnosis
 * are gas-sponsored — the user never needs xDAI for gas. This is the enabler
 * for the seamless "deposit auto-bakes into BREAD" flow (see useWatchFundedXdai).
 *
 * Requires, on the Privy dashboard for this app:
 *  - Embedded wallets enabled
 *  - Gas sponsorship (paymaster) enabled for Gnosis (chain 100)
 */
export function useSponsoredTx() {
	const { sendTransaction } = useSendTransaction();

	const sendSponsoredTransaction: typeof sendTransaction = (input, options) =>
		sendTransaction(
			{ ...input, chainId: GNOSIS_CHAIN_ID },
			{ ...options, sponsor: GNOSIS_CHAIN_ID === 100 }
		);

	return { sendSponsoredTransaction };
}
