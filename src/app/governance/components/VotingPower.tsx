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
import { HeartIcon } from "@phosphor-icons/react";

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
			<div>
				<div className="bg-paper-0 border border-[#EA5817] text-center py-2.5 px-6">
					<Heading3 className="text-surface-grey-2 mb-2.5 text-2xl">
						Your voting power:
					</Heading3>
					<div className="flex items-center justify-center gap-2">
						<span className="mb-[0.4rem]">
							<FistIcon />
						</span>
						<Heading2 className="text-2xl">
							{/* 230.68 */}
							{/* {userVotingPower !== null &&
								formatBalance(
									Number(formatUnits(userVotingPower, 18)),
									2
								)} */}
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
			</div>
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
	"py-3 sm:py-2 px-4 sm:w-[215px] flex flex-col items-center justify-center rounded-xl border-2";

function NotEnoughPower() {
	return (
		<div className={clsx(widgetBaseClasses, "border-status-danger")}>
			<span className="dark:text-breadgray-ultra-white font-bold text-xl">
				No Power
			</span>
			<a
				className="font-bold text-breadpink-shaded"
				href="https://breadchain.notion.site/BREAD-Voting-Power-UI-0f2d350320b94e4ba9aeec2ef6fdcb84"
				target="_blank"
				rel="noopener noreferrer"
			>
				Learn why
			</a>
		</div>
	);
}

function UserHasVoted({ cycleDates }: { cycleDates: CycleDatesSuccess }) {
	const days = differenceInDays(cycleDates.end, Date.now());

	return (
		<div className={clsx(widgetBaseClasses, "border-status-success")}>
			<div className="flex gap-4">
				<div className="w-7 h-7 flex items-center text-status-success">
					<CheckIcon />
				</div>
				<span className="dark:text-breadgray-ultra-white font-bold text-xl">
					Voted
				</span>
			</div>
			<div>
				<span className="dark:text-breadgray-grey">Next round: </span>
				<span>
					In {days} {days === 1 ? "day" : "days"}
				</span>
			</div>
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
