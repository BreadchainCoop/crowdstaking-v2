import clsx from "clsx";

import { CheckIcon } from "@/app/core/components/Icons/CheckIcon";
import { formatBalance } from "@/app/core/util/formatter";
import { TConnectedUserState } from "@/app/core/hooks/useConnectedUser";
import { CycleDatesSuccess } from "../useCycleDates";
import { CycleLengthSuccess } from "../useCycleLength";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import { formatUnits } from "viem";
import { differenceInDays } from "date-fns";

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
    <section className="sm:pt-8 sm:pb-4 flex flex-col sm:flex-row">
      <div className="grow">
        <div className="flex gap-2 items-center">
          <span className="size-6 flex rounded-full bg-white dark:bg-breadgray-charcoal">
            <FistIcon />
          </span>
          <span className="font-bold text-2xl leading-none text-breadgray-grey100 dark:text-breadgray-ultra-white">
            My voting power:{" "}
          </span>
          <span className="font-medium text-xl">
            {userVotingPower !== null &&
              formatBalance(Number(formatUnits(userVotingPower, 18)), 2)}
          </span>
        </div>
        <p className="max-w-96 text-breadgray-rye dark:text-breadgray-light-grey pt-2">
          {`Your Voting Power is equal to the average amount of BREAD you held during the ${Math.round(
            days
          )} days up until the current round of voting opened.`}
        </p>
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
          <DistributeEqually distributeEqually={distributeEqually} />
        ) : null}
      </div>
    </section>
  );
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
        <span>In {days} {days === 1 ? "day" : "days"}</span>
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
    <button
      className="dis-equally-button-bg text-white dark:text-breadgray-grey100 dark:hover:text-white rounded-xl p-2.5 flex items-center gap-3 border-2 border-breadgray-light-grey hover:border-breadgray-grey dark:border-breadgray-grey100 dark:hover:border-breadgray-ultra-white transform transition-all drop-shadow-[0_4px_10px_rgba(0,0,0,0.10)]"
      onClick={distributeEqually}
    >
      <div className="w-5 h-5 flex items-center">
        <svg
          className="fill-current"
          viewBox="0 0 22 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 0H4V2H2V4H0V10H2V12H4V14H6V16H8V18H10V20H12V18H14V16H16V14H18V12H20V10H22V4H20V2H18V0H14V2H12V4H10V2H8V0ZM8 2V4H10V6H12V4H14V2H18V4H20V10H18V12H16V14H14V16H12V18H10V16H8V14H6V12H4V10H2V4H4V2H8Z"
          />
        </svg>
      </div>

      <span className="text-lg font-bold">Distribute Equally</span>
    </button>
  );
}
