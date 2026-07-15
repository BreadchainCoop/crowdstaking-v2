import { ShieldCheckIcon } from "@phosphor-icons/react";
import clsx from "clsx";

/**
 * Persistent indicator shown in the navigation while a Gnosis Safe wallet is
 * connected. Signals to the user that transactions will require multi-sig
 * confirmation inside the Safe app rather than a standard wallet popup.
 */
export function SafeIndicatorBadge({ className }: { className?: string }) {
	return (
		<div
			className={clsx(
				"flex items-center gap-1.5 px-2 py-1 border border-primary-jade",
				"text-primary-jade font-bold text-sm bg-primary-jade/5 whitespace-nowrap",
				className
			)}
			title="A Gnosis Safe wallet is connected. Transactions are confirmed in the Safe app."
		>
			<ShieldCheckIcon size={16} color="#286B63" weight="bold" />
			<span>Safe</span>
		</div>
	);
}
