"use client";

import dynamic from "next/dynamic";
import { usePrivy } from "@privy-io/react-auth";
import { LiftedButton } from "@breadcoop/ui";
import { HandHeartIcon } from "@phosphor-icons/react";

import { useModal } from "@/app/core/context/ModalContext";

// FundWallet (and Privy's on-ramp SDK behind it) is only needed once a
// signed-in user actually clicks this button, not on every homepage load —
// see FundWallet.tsx's own Bridge lazy-load for the same reasoning.
const FundWallet = dynamic(
	() =>
		import("@/app/components/fund-wallet/FundWallet").then(
			(mod) => mod.FundWallet
		),
	{ ssr: false }
);

/**
 * Hero "Support fund" CTA.
 *  - Not signed in → Privy login (which provisions the embedded wallet).
 *  - Signed in     → opens the Fund-your-account deposit module (#425).
 *
 * Mirrors `PrivyDepositButton`'s behaviour, styled as the full-width hero CTA.
 */
export function SupportFundButton({ className }: { className?: string }) {
	const { ready, authenticated, login } = usePrivy();
	const { setModal } = useModal();

	const handleClick = () => {
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

	return (
		<LiftedButton
			onClick={handleClick}
			className={className}
			leftIcon={<HandHeartIcon size={20} weight="fill" />}
		>
			Support fund
		</LiftedButton>
	);
}
