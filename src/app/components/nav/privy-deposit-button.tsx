"use client";
/**
 * Isolated component that calls useFundWallet.
 * Must only be rendered when <PrivyProvider> is present in the tree
 * (i.e. when NEXT_PUBLIC_PRIVY_APP_ID is set).
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
		<div className="drop-shadow-[2px_2px_0px_#595959]">
			<button
				onPointerDown={(e) => e.stopPropagation()}
				onClick={handleDeposit}
				className="flex items-center bg-[#f6f3eb] border border-[#ea5817] overflow-hidden px-4 py-1 font-breadBody font-bold text-base text-[#ea5817] whitespace-nowrap hover:bg-[#ea5817] hover:text-white transition-colors"
			>
				Deposit
			</button>
		</div>
	);
}
