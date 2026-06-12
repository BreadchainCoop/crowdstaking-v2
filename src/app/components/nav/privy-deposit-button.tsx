"use client";
/**
 * Deposit button — the seamless "fund xDAI -> auto-bake BREAD" entry point.
 *
 * Targets the user's Privy *embedded* wallet:
 *  1. Ensure the user is authenticated with Privy (login creates the embedded
 *     wallet via `createOnLogin: "all-users"`).
 *  2. Open Privy's on-ramp to fund that wallet with xDAI (card / exchange /
 *     transfer).
 *  3. `useWatchFundedXdai` sees the xDAI land and immediately bakes it into
 *     BREAD with a gas-sponsored, UI-less transaction — no extra clicks.
 *
 * Styling mirrors the Figma "Small button" (Design System V1.1, node
 * 1401:2461) with the primary LiftedButton lift/press micro-interaction.
 */
import { useState } from "react";
import { Address } from "viem";
import { gnosis } from "viem/chains";
import { useFundWallet, usePrivy, useWallets } from "@privy-io/react-auth";

import { useWatchFundedXdai } from "@/app/core/hooks/useWatchFundedXdai";

export function PrivyDepositButton() {
	const { ready, authenticated, login } = usePrivy();
	const { fundWallet } = useFundWallet();
	const { wallets } = useWallets();
	const [depositing, setDepositing] = useState(false);

	const embedded = wallets.find((w) => w.walletClientType === "privy");
	const embeddedAddress = embedded?.address as Address | undefined;

	// Only watch while a deposit is in progress, so we aren't polling every
	// block app-wide. Auto-bakes the xDAI the moment it lands.
	useWatchFundedXdai(depositing ? embeddedAddress : undefined, async () => {
		setDepositing(false);
	});

	const handleDeposit = async (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		if (!ready) return;

		// No embedded wallet yet -> log in with Privy first (creates one).
		if (!authenticated || !embeddedAddress) {
			login();
			return;
		}

		setDepositing(true);
		try {
			await fundWallet({
				address: embeddedAddress,
				options: {
					chain: gnosis,
					uiConfig: { receiveFundsTitle: "Receive xDAI" },
				},
			});
			// The xDAI watcher handles baking once funds arrive. If the user
			// exits the on-ramp without funding, stop watching.
		} catch {
			setDepositing(false);
		}
	};

	return (
		<button
			type="button"
			onPointerDown={(e) => e.stopPropagation()}
			onClick={handleDeposit}
			className="group relative inline-flex shrink-0 cursor-pointer"
		>
			{/* Shadow layer — sits 2px down-right behind the face */}
			<span
				aria-hidden="true"
				className="absolute inset-0 translate-x-[2px] translate-y-[2px] bg-[#595959]"
			/>
			{/* Face — lifted above the shadow; presses onto it on :active */}
			<span className="relative flex items-center bg-[#f6f3eb] border border-[#ea5817] px-4 py-1 font-breadBody font-bold text-base leading-[1.5] text-[#ea5817] whitespace-nowrap transition-[transform,background-color,color] duration-100 ease-out group-hover:bg-[#ea5817] group-hover:text-white group-active:translate-x-[2px] group-active:translate-y-[2px]">
				{depositing ? "Depositing…" : "Deposit"}
			</span>
		</button>
	);
}
