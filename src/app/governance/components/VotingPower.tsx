import clsx from "clsx";

import { CheckIcon } from "@/app/core/components/Icons/CheckIcon";
import { formatBalance } from "@/app/core/util/formatter";
import { TConnectedUserState } from "@/app/core/hooks/useConnectedUser";
import { CycleDatesSuccess } from "../useCycleDates";
import { CycleLengthSuccess } from "../useCycleLength";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import { formatUnits } from "viem";
import { differenceInDays } from "date-fns";
import { Body, Heading2, Heading3, LiftedButton } from "@breadcoop/ui";
import { ArrowUpRightIcon, HeartIcon } from "@phosphor-icons/react";

export function VotingPower({
	minRequiredVotingPower,
	userVotingPower,
	userHasVoted,
	userCanVote,
	cycleDates,
	cycleLength,
	user,
	distributeEqually,
	isRecasting,
}: {
	minRequiredVotingPower: number | null;
	userVotingPower: bigint | null;
	userHasVoted: boolean;
	userCanVote: boolean;
	cycleDates: CycleDatesSuccess;
	cycleLength: CycleLengthSuccess;
	user: TConnectedUserState;
	distributeEqually: () => void;
	isRecasting: boolean;
}) {
	const days = (cycleLength.data * 5) / 60 / 60 / 24;
	return (
		<section className="lg:flex lg:items-start lg:justify-between lg:gap-2">
			<div className="lg:max-w-[22.4375rem] lg:gap-6">
				<Heading3 className="hidden lg:block lg:text-2xl">
					Voting Power
				</Heading3>
				<Body className="mb-6">
					Your Voting Power is equal to the average amount of BREAD
					you held during the 30 days up until the current round of
					voting opened.
				</Body>
			</div>
			{userHasVoted && !isRecasting ? (
				<UserHasVoted cycleDates={cycleDates} />
			) : !userCanVote &&
			  minRequiredVotingPower !== null &&
			  userVotingPower !== null &&
			  userVotingPower < minRequiredVotingPower ? (
				<NotEnoughPower />
			) : (
				<div>
					<div className="bg-paper-0 border border-[#EA5817] text-center py-2.5 px-6">
						<Heading3 className="text-surface-grey-2 mb-2.5 text-2xl">
							Your voting power:
						</Heading3>
						<div className="flex items-center justify-center gap-2">
							<span className="mb-[0.2rem]">
								<FistIcon />
							</span>
							<Body className="text-2xl font-bold">
								{userVotingPower
									? formatBalance(
											Number(
												formatUnits(userVotingPower, 18)
											),
											2
									  )
									: "-"}
							</Body>
						</div>
					</div>
					{user.status === "CONNECTED" && (
						<DistributeEqually
							distributeEqually={distributeEqually}
						/>
					)}
				</div>
			)}
			{/* <div>
				<div className="bg-paper-0 border border-[#EA5817] text-center py-2.5 px-6">
					<Heading3 className="text-surface-grey-2 mb-2.5 text-2xl">
						Your voting power:
					</Heading3>
					<div className="flex items-center justify-center gap-2">
						<span className="mb-[0.4rem]">
							<FistIcon />
						</span>
						<Heading2 className="text-2xl">
							{userVotingPower
								? formatBalance(
										Number(
											formatUnits(userVotingPower, 18)
										),
										2
								  )
								: "-"}
						</Heading2>
					</div>
				</div>
				<div className="pt-6 sm:p-0">
					{userHasVoted && !isRecasting ? (
						<UserHasVoted cycleDates={cycleDates} />
					) : !userCanVote &&
					  minRequiredVotingPower !== null &&
					  userVotingPower !== null &&
					  userVotingPower < minRequiredVotingPower ? (
						<NotEnoughPower />
					) : user.status === "CONNECTED" ? (
						<DistributeEqually
							distributeEqually={distributeEqually}
						/>
					) : null}
				</div>
			</div> */}
		</section>
	);

	// return (
	// 	<section className="sm:pt-8 sm:pb-4 flex flex-col sm:flex-row">
	// 		<div className="grow">
	// 			<div className="flex gap-2 items-center">
	// 				<span className="size-6 flex rounded-full bg-white dark:bg-breadgray-charcoal">
	// 					<FistIcon />
	// 				</span>
	// 				<span className="font-bold text-2xl leading-none text-breadgray-grey100 dark:text-breadgray-ultra-white">
	// 					My voting power:{" "}
	// 				</span>
	// 				<span className="font-medium text-xl">
	// 					{userVotingPower !== null &&
	// 						formatBalance(
	// 							Number(formatUnits(userVotingPower, 18)),
	// 							2
	// 						)}
	// 				</span>
	// 			</div>
	// 			<p className="max-w-96 text-breadgray-rye dark:text-breadgray-light-grey pt-2">
	// 				{`Your Voting Power is equal to the average amount of BREAD you held during the ${Math.round(
	// 					days
	// 				)} days up until the current round of voting opened.`}
	// 			</p>
	// 		</div>
	// 		<div className="pt-6 sm:p-0">
	// 			{userHasVoted && !isRecasting ? (
	// 				<UserHasVoted cycleDates={cycleDates} />
	// 			) : !userCanVote &&
	// 			  minRequiredVotingPower !== null &&
	// 			  userVotingPower !== null &&
	// 			  userVotingPower < minRequiredVotingPower ? (
	// 				<NotEnoughPower />
	// 			) : user.status === "CONNECTED" ? (
	// 				<DistributeEqually distributeEqually={distributeEqually} />
	// 			) : null}
	// 		</div>
	// 	</section>
	// );
}
const widgetBaseClasses =
	"py-3 px-4 flex flex-col items-center justify-center border mx-auto gap-2.5 sm:py-2 sm:w-[22.125rem] lg:mr-0 lg:mt-4";

function NotEnoughPower() {
	return (
		<div className={clsx(widgetBaseClasses, "border-system-red")}>
			<Heading3 className="text-2xl text-surface-grey-2">
				No voter power
			</Heading3>
			<a
				className="font-bold text-[#EA5817] flex items-center justify-center gap-2"
				href="https://breadchain.notion.site/BREAD-Voting-Power-UI-0f2d350320b94e4ba9aeec2ef6fdcb84"
				target="_blank"
				rel="noopener noreferrer"
			>
				Learn why
				<ArrowUpRightIcon />
			</a>
		</div>
	);
}

function UserHasVoted({ cycleDates }: { cycleDates: CycleDatesSuccess }) {
	const days = differenceInDays(cycleDates.end, Date.now());

	return (
		<div className={clsx(widgetBaseClasses, "border-system-green")}>
			<div className="flex gap-4">
				<div className="flex items-center text-system-green">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8.25 12.75L10.5 15L15.75 9.75"
							stroke="#32A800"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
							stroke="#32A800"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<Heading3 className="text-2xl">Voted Casted</Heading3>
			</div>
			<Body>
				<span className="font-bold">Next round: </span>
				<span>
					In {days} {days === 1 ? "day" : "days"}
				</span>
			</Body>
		</div>
	);
}

function DistributeEqually({
	distributeEqually,
}: {
	distributeEqually: () => void;
}) {
	return (
		<div className="lifted-button-container mt-6">
			<LiftedButton onClick={distributeEqually} leftIcon={<HeartIcon />}>
				Distribute Equally
			</LiftedButton>
		</div>
	);
}
