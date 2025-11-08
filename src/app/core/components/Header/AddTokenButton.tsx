import { BreadIcon } from "@/app/core/components/Icons/TokenIcons";
import { useWatchAsset } from "@/app/core/hooks/useWatchAsset";
import { Caption, Logo } from "@breadcoop/ui";
import clsx from "clsx";

export function AddTokenButton({ className }: { className?: string }) {
	const { watchAsset } = useWatchAsset();

	return (
		<button
			className={clsx(
				// "flex w-full whitespace-nowrap rounded-full mt-2 px-3 py-2 dark:bg-breadgray-toast bg-breadgray-white border border-breadgray-white dark:hover:bg-breadgray-burnt dark:border-none dark:hover:border-none hover:border-breadpink-pink text-base",
				"flex w-full whitespace-nowrap",
				className
			)}
			onClick={watchAsset}
		>
			<div className="flex gap-2 m-auto items-center">
				<Logo size={24} variant="square" />
				<Caption className="text-center">Add token to wallet</Caption>
			</div>
		</button>
	);
}
