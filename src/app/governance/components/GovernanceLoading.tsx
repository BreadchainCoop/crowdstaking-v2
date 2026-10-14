import { Hex } from "viem";
import { Heading2, Body, Caption } from "@breadcoop/ui";
import { projectsMeta } from "@/app/projectsMeta";
import { StaticProjectProvider } from "@/app/core/context/ProjectContext/ProjectContext";
import type { TConnectedUserState } from "@/app/core/hooks/useConnectedUser";
import type { CycleDatesState } from "../useCycleDates";
import type { CurrentVotingDistributionState } from "../useCurrentVotingDistribution";
import { DistributionOverview } from "./DistributionOverview";
import { ResultsPanel } from "./ResultsPanel";
import { VotingPower } from "./VotingPower";
import { ProjectRow, VoteForm } from "./ProjectRow";
import { CastVotePanel } from "./CastVote";

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

const noop = () => {};

// The loaded page with every label already in place. Only the numbers are
// missing ("--"), so the layout doesn't change when the data arrives.
export function GovernanceLoading({
	user,
	cycleDates,
	distribution,
	minRequiredVotingPower,
	userVotingPower,
}: {
	user: TConnectedUserState;
	cycleDates: CycleDatesState;
	distribution: CurrentVotingDistributionState;
	minRequiredVotingPower: number | null;
	userVotingPower: bigint | null;
}) {
	const activeProjects = (Object.keys(projectsMeta) as Hex[])
		.filter((address) => projectsMeta[address].active)
		.toSorted((a, b) => projectsMeta[a].order - projectsMeta[b].order);

	return (
		<section
			className="grow w-full max-w-[44rem] lg:max-w-[67rem] m-auto pb-16 px-4 lg:px-8"
			aria-busy="true"
		>
			<div className="lg:grid lg:grid-cols-[2fr_1fr] lg:min-h-0 lg:gap-x-[1.0625rem] lg:gap-y-4 lg:content-between lg:mb-[1.625rem]">
				<GovernanceHeader />

				<div className="flex flex-col gap-6 mb-8 lg:mb-0 lg:max-w-[22.0625rem] lg:col-start-2 lg:row-start-1 lg:row-end-3 lg:ml-auto">
					<DistributionOverview cycleDates={cycleDates} />
					<ResultsPanel distribution={distribution} />
				</div>

				<div className="lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:h-full lg:gap-y-6">
					<VotingPower
						minRequiredVotingPower={minRequiredVotingPower}
						userVotingPower={userVotingPower}
						userHasVoted={false}
						cycleDates={cycleDates}
						userCanVote={false}
						user={user}
						distributeEqually={noop}
						isRecasting={false}
					/>
					<div className="col-span-12 row-start-5 lg:col-start-1 lg:col-span-8 lg:row-start-3 grid grid-cols-1 gap-3">
						{activeProjects.map((address) => (
							<div key={`project_row_${address}`}>
								<StaticProjectProvider>
									<ProjectRow address={address}>
										<VoteForm
											value={null}
											updateValue={noop}
											address={address}
											totalPoints={0}
											user={user}
											userCanVote={false}
											disabled
										/>
									</ProjectRow>
								</StaticProjectProvider>
							</div>
						))}
						<CastVotePanel
							user={user}
							userVote={[]}
							userHasVoted={false}
							userCanVote={false}
							isSafe={false}
							isRecasting={false}
							setIsRecasting={noop}
							resetFormState={noop}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
