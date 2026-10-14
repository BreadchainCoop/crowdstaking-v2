import { Heading2, Body, Caption } from "@breadcoop/ui";

// Static intro: doesn't depend on chain data, so it renders immediately.
export function GovernanceHeader() {
	return (
		<div className="mb-8 lg:mb-0 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:h-full">
			<Heading2 className="text-2xl lg:text-[2.5rem]">
				<span className="uppercase">Bread Solidarity Fund &mdash;</span>{" "}
				Vote
			</Heading2>
			<Body className="py-4 max-w-xl">
				Distribute your voting power across the various projects in the
				Solidarity Fund to influence how much yield is given to each.
			</Body>
			<Caption>
				* Distributions will be made at the end of the month based on
				all votes received.
			</Caption>
		</div>
	);
}

function Block({ className }: { className: string }) {
	return (
		<div
			className={`bg-paper-0 animate-pulse motion-reduce:animate-none ${className}`}
		/>
	);
}

// Mirrors the loaded layout in GovernancePage so nothing jumps when data arrives.
export function GovernanceSkeleton() {
	return (
		<section
			className="grow w-full max-w-[44rem] lg:max-w-[67rem] m-auto pb-16 px-4 lg:px-8"
			aria-busy="true"
			aria-label="Loading governance data"
		>
			<div className="lg:grid lg:grid-cols-[2fr_1fr] lg:min-h-0 lg:gap-x-[1.0625rem] lg:gap-y-4 lg:content-between lg:mb-[1.625rem]">
				<GovernanceHeader />

				<div className="flex flex-col gap-6 mb-8 lg:mb-0 lg:max-w-[22.0625rem] lg:col-start-2 lg:row-start-1 lg:row-end-3 lg:ml-auto lg:w-full">
					<Block className="h-40" />
					<Block className="h-72" />
				</div>

				<div className="lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:h-full lg:gap-y-6">
					<Block className="h-28 mb-6 lg:mb-0" />
					<div className="grid grid-cols-1 gap-3">
						{Array.from({ length: 4 }, (_, i) => (
							<Block key={i} className="h-36" />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
