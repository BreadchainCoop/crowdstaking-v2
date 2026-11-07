"use client";

import { LiftedButton } from "@breadcoop/ui";
import { HandHeartIcon } from "@phosphor-icons/react";

import { useOpenFundWallet } from "@/app/components/fund-wallet/useOpenFundWallet";

/**
 * Hero "Support fund" CTA.
 *  - Not signed in → Privy login (which provisions the embedded wallet).
 *  - Signed in     → opens the Fund-your-account deposit module (#425).
 *
 * Mirrors `PrivyDepositButton`'s behaviour, styled as the full-width hero CTA.
 */
export function SupportFundButton({ className }: { className?: string }) {
	const openFundWallet = useOpenFundWallet();

	return (
		<LiftedButton
			onClick={openFundWallet}
			className={className}
			leftIcon={<HandHeartIcon size={20} />}
		>
			Support fund
		</LiftedButton>
	);
}
