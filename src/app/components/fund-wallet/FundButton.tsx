"use client";
import { ReactNode } from "react";
import { Body } from "@breadcoop/ui";

export interface FundButtonProps {
	icon: ReactNode;
	title: string;
	subtitle: string;
	onClick: () => void;
	disabled?: boolean;
}

/**
 * A single funding-option row in the Fund modal (mirrors the app-stacks
 * "fund" option rows). Paper card with an orange hover border.
 */
export function FundButton({
	icon,
	title,
	subtitle,
	onClick,
	disabled = false,
}: FundButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="flex w-full items-center justify-start gap-4 border border-[#eae2d6] bg-paper-0 px-5 py-3 text-left transition-colors hover:border-[#ea5817] disabled:cursor-not-allowed disabled:opacity-50"
		>
			<span className="flex size-8 shrink-0 items-center justify-center text-[#ea5817]">
				{icon}
			</span>
			<span className="mr-auto">
				<Body bold className="text-surface-ink">
					{title}
				</Body>
				<Body className="text-surface-grey text-sm">{subtitle}</Body>
			</span>
		</button>
	);
}
