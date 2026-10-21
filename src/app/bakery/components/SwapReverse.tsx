import { ArrowsDownUpIcon } from "@phosphor-icons/react";

type TProps = {
	onClick: () => void;
};

function SwapReverse({ onClick }: TProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Swap direction"
			className="w-8 h-8 flex items-center justify-center border-[0.041875rem] border-surface-ink bg-paper-main"
		>
			<ArrowsDownUpIcon color="#EA5817" />
		</button>
	);
}

export default SwapReverse;
