"use client";
/**
 * Isolated component that calls useFundWallet.
 * Must only be rendered when <PrivyProvider> is present in the tree
 * (i.e. when NEXT_PUBLIC_PRIVY_APP_ID is set).
 *
 * Styling mirrors the Figma "Small button" (Design System V1.1, node
 * 1401:2461): paper face, orange border + label, with the same lift/press
 * micro-interaction as the primary LiftedButton — a #595959 shadow layer the
 * face sits above, then presses into on :active.
 */
import { useFundWallet } from "@privy-io/react-auth";

export function PrivyDepositButton({ address }: { address: string }) {
	const { fundWallet } = useFundWallet();

	const handleDeposit = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		fundWallet({ address });
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
