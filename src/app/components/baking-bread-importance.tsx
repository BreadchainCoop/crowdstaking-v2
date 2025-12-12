import { Body } from "@breadcoop/ui";
import clsx from "clsx";

const BakingBreadImportance = ({ className }: { className?: string }) => {
	return (
		<div
			className={clsx(
				"border border-system-green flex items-start justify-start p-4",
				className
			)}
		>
			<div className="mr-2">
				<InfoSvg />
			</div>
			<Body className="text-surface-grey">
				Baking $BREAD increases crucial funding for our post-capitalist
				cooperatives.{" "}
				<a
					href="https://docs.bread.coop/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-[#EA5817] font-bold"
				>
					How does this work?
				</a>
			</Body>
		</div>
	);
};

const InfoSvg = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
			stroke="#32A800"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11.25 11.25C11.4489 11.25 11.6397 11.329 11.7803 11.4697C11.921 11.6103 12 11.8011 12 12V15.75C12 15.9489 12.079 16.1397 12.2197 16.2803C12.3603 16.421 12.5511 16.5 12.75 16.5"
			stroke="#32A800"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M11.625 9C12.2463 9 12.75 8.49632 12.75 7.875C12.75 7.25368 12.2463 6.75 11.625 6.75C11.0037 6.75 10.5 7.25368 10.5 7.875C10.5 8.49632 11.0037 9 11.625 9Z"
			fill="#32A800"
		/>
	</svg>
);

export default BakingBreadImportance;
