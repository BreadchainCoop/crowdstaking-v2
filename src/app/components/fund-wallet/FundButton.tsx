"use client";
import { ReactNode } from "react";
import { Body } from "@breadcoop/ui";

export interface FundButtonProps {
	icon: ReactNode;
	title: string;
	subtitle: string;
	onClick: () => void;
	disabled?: boolean;
	badge?: ReactNode;
}

/**
 * A single funding-option row in the Fund modal (mirrors the app-stacks
 * "fund" option rows). Paper card with an orange hover border. An optional
 * `badge` renders next to the title (e.g. a "Recommended" pill).
 */
export function FundButton({
	icon,
	title,
	subtitle,
	onClick,
	disabled = false,
	badge,
}: FundButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className="flex w-full items-center justify-start gap-4 border border-paper-2 bg-paper-0 px-5 py-2.5 text-left transition-colors hover:border-primary-orange hover:bg-[#EA60231a] disabled:cursor-not-allowed disabled:opacity-50"
		>
			<span className="flex size-8 shrink-0 items-center justify-center text-primary-orange">
				{icon}
			</span>
			<span className="mr-auto">
				<span className="flex items-center gap-2">
					<Body bold className="text-surface-ink">
						{title}
					</Body>
					{badge}
				</span>
				<Body className="mt-0.5 text-surface-grey text-sm">
					{subtitle}
				</Body>
			</span>
		</button>
	);
}
