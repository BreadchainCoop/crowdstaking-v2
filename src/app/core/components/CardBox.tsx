import clsx from "clsx";
import { ReactNode } from "react";

export function CardBox({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={clsx("border border-surface-grey bg-paper-0", className)}
		>
			{children}
		</div>
	);
}
