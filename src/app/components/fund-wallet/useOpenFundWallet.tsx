"use client";

import dynamic from "next/dynamic";
import { usePrivy } from "@privy-io/react-auth";

import { useModal } from "@/app/core/context/ModalContext";

// Deferred: FundWallet (and Privy's on-ramp SDK behind it) is only needed
// once a user actually asks to deposit, not on every page that renders a
// deposit entry point.
const FundWallet = dynamic(
	() =>
		import("@/app/components/fund-wallet/FundWallet").then(
			(mod) => mod.FundWallet
		),
	{ ssr: false }
);

/**
 * Returns a handler that starts the deposit (bake) flow:
 *  - Not signed in → Privy login (which provisions the embedded wallet).
 *  - Signed in     → opens the Fund-your-account deposit module.
 */
export function useOpenFundWallet() {
	const { ready, authenticated, login } = usePrivy();
	const { setModal } = useModal();

	return () => {
		if (!ready) return;

		if (!authenticated) {
			login();
			return;
		}

		setModal({
			type: "GENERIC_MODAL",
			showCloseButton: true,
			includeContainerStyling: true,
			children: <FundWallet />,
		});
	};
}
