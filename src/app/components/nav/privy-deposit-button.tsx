"use client";
/**
 * Deposit button — opens the Fund module (fund xDAI -> auto-bake BREAD).
 *
 * If the user isn't authenticated yet, it triggers Privy login (which
 * provisions the embedded wallet via `createOnLogin: "all-users"`); otherwise
 * it opens the Fund modal where they pick a funding option. The xDAI that lands
 * in the embedded wallet is auto-baked into BREAD by `useWatchFundedXdai`
 * (mounted inside the modal).
 *
 * Styling mirrors the Figma "Small button" (Design System V1.1, node
 * 1401:2461) with the primary LiftedButton lift/press micro-interaction.
 */
import { usePrivy } from "@privy-io/react-auth";

import { useModal } from "@/app/core/context/ModalContext";
import { FundWallet } from "@/app/components/fund-wallet/FundWallet";

export function PrivyDepositButton() {
	const { ready, authenticated, login } = usePrivy();
	const { setModal } = useModal();

	const handleDeposit = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
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
				Deposit
			</span>
		</button>
	);
}
