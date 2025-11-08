import { ExternalLink } from "@/app/core/components/ExternalLink";
import { CURVE_SWAP_URL } from "@/constants";
import { Body, LiftedButton } from "@breadcoop/ui";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

export default function SwapBreadButton({
	withRecommended,
}: {
	withRecommended: boolean;
}) {
	return (
		<ExternalLink href={CURVE_SWAP_URL} className="w-full">
			{withRecommended && (
				<Body bold className="text-center text-system-green">
					Recommended
				</Body>
			)}
			<div className="lifted-button-container">
				<LiftedButton rightIcon={<ArrowUpRightIcon />}>
					Swap BREAD for WXDAI
				</LiftedButton>
			</div>
		</ExternalLink>
	);
}
