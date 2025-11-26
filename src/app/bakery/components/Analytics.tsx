"use client";

import { LiftedButton } from "@breadcoop/ui";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export const ViewAnalytics = () => {
	const router = useRouter();

	return (
		<div className="lifted-button-container max-w-[10.6875rem]">
			<LiftedButton
				preset="stroke"
				className="border border-black !py-1 px-4 !h-8"
				onClick={() => {
					window.open(
						"https://dune.com/bread_cooperative/solidarity",
						"_blank"
					);
				}}
				rightIcon={
					<ArrowUpRightIcon color="var(--color-primary-orange)" />
				}
			>
				View analytics
			</LiftedButton>
		</div>
	);
};
