"use client";
/**
 * Withdraw button for the account dropdown. Opens the Withdraw module, where an
 * EOA chooses to exchange their deposit for WXDAI on Curve (recommended) or
 * withdraw it in xDAI (burn). Only shown for external wallets (EOAs): an
 * embedded Privy wallet withdraws by moving funds out to an external wallet,
 * which is a separate flow (see [[crowdstaking-v2-profile]] withdrawal
 * decision), so this button hides for the embedded wallet.
 */
import dynamic from "next/dynamic";
import { Address } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { LiftedButton } from "@breadcoop/ui";
import { ArrowLineDownIcon } from "@phosphor-icons/react";
import clsx from "clsx";

import { useModal } from "@/app/core/context/ModalContext";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";

const WithdrawModule = dynamic(
	() =>
		import("@/app/components/withdraw/WithdrawModule").then(
			(mod) => mod.WithdrawModule
		),
	{ ssr: false }
);

export function WithdrawButton({ className }: { className?: string }) {
	const { setModal } = useModal();
	const { user } = useConnectedUser();
	const { wallets } = useWallets();

	const activeAddress =
		user.status === "CONNECTED" ? user.address.toLowerCase() : undefined;
	const embedded = wallets.find((w) => w.walletClientType === "privy");
	const embeddedAddress = embedded?.address as Address | undefined;
	const isEmbeddedActive = Boolean(
		embeddedAddress && embeddedAddress.toLowerCase() === activeAddress
	);

	// Embedded wallets withdraw via a separate "send to an external wallet"
	// flow, so the EOA swap/burn options don't apply to them.
	if (user.status !== "CONNECTED" || isEmbeddedActive) return null;

	return (
		<div className={clsx("lifted-button-container", className)}>
			<LiftedButton
				preset="secondary"
				rightIcon={<ArrowLineDownIcon />}
				onClick={() =>
					setModal({
						type: "GENERIC_MODAL",
						showCloseButton: true,
						includeContainerStyling: true,
						children: <WithdrawModule />,
					})
				}
			>
				Withdraw
			</LiftedButton>
		</div>
	);
}
