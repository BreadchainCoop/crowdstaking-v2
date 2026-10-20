"use client";
/**
 * Withdraw button for the account dropdown. Opens the Withdraw module, which
 * adapts to the wallet type: an EOA exchanges for WXDAI on Curve (recommended)
 * or withdraws in xDAI (burn); an embedded Privy wallet sends its deposit out
 * to an external wallet (recommended) or withdraws in xDAI. Shown for every
 * connected wallet.
 */
import dynamic from "next/dynamic";
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

	if (user.status !== "CONNECTED") return null;

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
