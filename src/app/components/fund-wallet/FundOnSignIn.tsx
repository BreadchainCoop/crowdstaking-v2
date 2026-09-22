"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Address } from "viem";
import { gnosis } from "viem/chains";
import { useBalance } from "wagmi";
import { usePrivy, useWallets } from "@privy-io/react-auth";

import { useModal } from "@/app/core/context/ModalContext";
import { BREAD_ADDRESS } from "@/constants";
import { useWatchFundedXdai } from "@/app/core/hooks/useWatchFundedXdai";

// Deferred: only needed the moment we actually prompt to fund, not on every
// page load for every signed-in user.
const FundWallet = dynamic(
	() => import("./FundWallet").then((mod) => mod.FundWallet),
	{ ssr: false }
);

/**
 * On first sign-in, if the embedded wallet holds neither xDAI nor BREAD, prompt
 * the user to fund it. Also runs the auto-bake watcher for the whole session
 * (not just while the Fund modal happens to be open) so xDAI landing from an
 * on-ramp purchase or bridge transfer -- which can take minutes to hours --
 * still auto-bakes even after the user closes the modal.
 * Renders nothing; just orchestrates the prompt once per session. Mounted
 * inside the provider tree (Privy + wagmi + ModalProvider).
 */
export function FundOnSignIn() {
	const { ready, authenticated } = usePrivy();
	const { wallets } = useWallets();
	const { setModal } = useModal();
	const prompted = useRef(false);

	const embedded = wallets.find((w) => w.walletClientType === "privy");
	const address = embedded?.address as Address | undefined;

	useWatchFundedXdai(address);

	const { data: native } = useBalance({
		address,
		chainId: gnosis.id,
		query: { enabled: Boolean(address) },
	});
	const { data: bread } = useBalance({
		address,
		token: BREAD_ADDRESS as Address,
		chainId: gnosis.id,
		query: { enabled: Boolean(address) },
	});

	useEffect(() => {
		if (prompted.current) return;
		if (!ready || !authenticated || !address) return;
		if (!native || !bread) return;

		if (native.value === BigInt(0) && bread.value === BigInt(0)) {
			prompted.current = true;
			setModal({
				type: "GENERIC_MODAL",
				showCloseButton: true,
				includeContainerStyling: true,
				children: <FundWallet />,
			});
		}
	}, [ready, authenticated, address, native, bread, setModal]);

	return null;
}
