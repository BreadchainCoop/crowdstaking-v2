import { ReactElement } from "react";
import { CardBox } from "@/app/core/components/CardBox";
import { FistIcon } from "@/app/core/components/Icons/FistIcon";
import { AccountMenu } from "@/app/core/components/Header/AccountMenu";
import { LinkIcon } from "@/app/core/components/Icons/LinkIcon";
import {
  TUserConnected,
  useConnectedUser,
} from "@/app/core/hooks/useConnectedUser";
import { useVotingPower } from "../../context/VotingPowerContext";
import { formatBalance } from "@/app/core/util/formatter";
import { useCurrentAccumulatedVotingPower } from "../../useCurrentAccumulatedVotingPower";
import Elipsis from "@/app/core/components/Elipsis";
import { useTokenBalances } from "@/app/core/context/TokenBalanceContext/TokenBalanceContext";

import { useCycleLength } from "../../useCycleLength";
import { useVaultTokenBalance } from "../context/VaultTokenBalanceContext";
import Tooltip from "@/app/core/components/Tooltip";
import { useDistributions } from "../../useDistributions";

export function VotingPowerPanel() {
  const { user } = useConnectedUser();

  const votingPower = useVotingPower();
  const vaultTokenBalance = useVaultTokenBalance();
  const { totalDistributions } = useDistributions();
  const { BREAD } = useTokenBalances();

  const renderFormattedDecimalNumber = (
    number: string,
    icon?: ReactElement
  ) => {
    const part1 = number.split(".")[0];
    const part2 = number.split(".")[1];

    return (
      <div className="w-full flex justify-center tracking-wider text-3xl font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white leading-none">
        <div className=" flex gap-2  justify-end">
          {icon && <div className="mt-1">{icon}</div>}
          <span>{part1}</span>
        </div>
        <div>.</div>
        <div className="text-xl leading-[1.1] w-[56px] self-end">{part2}</div>
      </div>
    );
  };

  return (
    <div className="col-span-12 lg:col-span-4 row-start-2 lg:row-start-1 lg:row-span-2">
      <div className="justify-center lg:block lg:w-full">
        <CardBox>
          <div className="p-4 flex flex-col items-center gap-4">
            <h2 className="font-medium text-xl leading-none dark:text-breadgray-light-grey">
              MY VOTING POWER
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <div className="font-bold text-3xl w-full leading-none text-breadgray-grey100 dark:text-breadgray-ultra-white">
                  {votingPower &&
                  votingPower.bread.status === "success" &&
                  votingPower.butteredBread.status === "success" ? (
                    renderFormattedDecimalNumber(
                      formatBalance(
                        Number(
                          votingPower.bread.value +
                            votingPower.butteredBread.value
                        ) /
                          10 ** 18,
                        1
                      ),
                      <FistIcon bg="burnt" />
                    )
                  ) : (
                    <div className="flex justify-center items-center">
                      <FistIcon bg="burnt" />
                      <span className="ms-2">-</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 font-medium text-xs text-breadgray-rye dark:text-breadgray-grey">
                <span className="pb-1">Accessible voting power</span>
                <Tooltip>
                  Your total available voting power for the current voting cycle
                  #{totalDistributions ? totalDistributions + 1 + "." : "-"}
                </Tooltip>
              </div>
            </div>

            {/* voting power grid */}
            <div className="w-full grid grid-cols-[repeat(2, max-content)] gap-3">
              <DividerWithText text="Breakdown" />

              <p className="text-breadgray-rye dark:text-breadgray-grey">
                Voting power from locked LP
              </p>

              <span className="font-bold text-breadgray-grey100 dark:text-breadgray-white text-right">
                {votingPower && votingPower.butteredBread.status === "success"
                  ? formatBalance(
                      Number(votingPower.butteredBread.value) / 10 ** 18,
                      1
                    )
                  : "-"}
              </span>

              <p className="text-breadgray-rye dark:text-breadgray-grey">
                Voting power from $BREAD
              </p>
              <span className="text-right font-bold text-breadgray-grey100 dark:text-breadgray-white">
                {votingPower && votingPower.bread.status === "success"
                  ? formatBalance(Number(votingPower.bread.value) / 10 ** 18, 1)
                  : "-"}
              </span>
              <DividerWithText text="Source(s)" />

              <p className="text-breadgray-rye dark:text-breadgray-grey">
                Total locked LP tokens
              </p>

              <span className="text-right font-bold text-breadpink-100">
                {vaultTokenBalance &&
                vaultTokenBalance.butter.status === "success"
                  ? formatBalance(
                      Number(vaultTokenBalance.butter.value) / 10 ** 18,
                      0
                    )
                  : "-"}
              </span>

              {user.status === "CONNECTED" && (
                <>
                  <p className="text-breadgray-rye dark:text-breadgray-grey">
                    Total $BREAD baked
                  </p>

                  <span className="font-bold text-breadgray-grey100 dark:text-breadgray-white text-right">
                    {BREAD && BREAD.status === "SUCCESS"
                      ? formatBalance(parseFloat(BREAD.value), 2)
                      : "-"}
                  </span>
                </>
              )}

              {user.status === "CONNECTED" ? (
                <>
                  <DividerWithText text="Future voting power" />

                  <p className="text-breadgray-rye dark:text-breadgray-grey">
                    <div className="flex items-center gap-2">
                      <span className="pb-1">Pending voting power</span>
                      <Tooltip>
                        The voting power you will receive in the next voting
                        cycle.
                      </Tooltip>
                    </div>
                  </p>

                  <span className="text-right w-27 font-bold text-breadgray-rye dark:text-breadgray-grey">
                    <PendingVotingPowerDisplay user={user} />
                  </span>
                </>
              ) : (
                <></>
              )}

              {user.status === "CONNECTED" ? (
                <></>
              ) : (
                <div className="col-span-2 pt-3">
                  <AccountMenu size="large" fullWidth>
                    Connect
                  </AccountMenu>
                </div>
              )}
            </div>
            <a
              className="flex items-center gap-2 text-sm font-medium pt-4 text-breadgray-grey100 hover:text-breadpink-shaded dark:text-breadgray-ultra-white"
              href="https://breadchain.notion.site/Voting-Power-LP-Vaults-15e0ad9b12798026a4e6cb917c3137a5?pvs=74"
              target="_blank"
              rel="noopener noreferrer"
            >
              How does this work?
              <div className="text-breadpink-shaded">
                <LinkIcon />
              </div>
            </a>
          </div>
        </CardBox>
      </div>
    </div>
  );
}

function DividerWithText({ text }: { text: string }) {
  return (
    <div className="flex col-span-2 py-2 h-[1px] items-center">
      <div className="flex-1 border-t border-breadgray-light-grey dark:border-breadgray-rye"></div>
      <span className="px-2 whitespace-nowrap font-medium text-xs text-breadgray-grey dark:text-breadgray-rye">
        {text}
      </span>
      <div className="flex-1 border-t border-breadgray-light-grey dark:border-breadgray-rye"></div>
    </div>
  );
}

function Divider() {
  return (
    <div className="col-span-2 h-[1px] bg-breadgray-light-grey dark:bg-breadgray-rye" />
  );
}

function PendingVotingPowerDisplay({ user }: { user: TUserConnected }) {
  const {
    status: currentAccumulatedVotingPowerStatus,
    data: currentAccumulatedVotingPowerData,
  } = useCurrentAccumulatedVotingPower(user);

  const { cycleLength } = useCycleLength();

  return currentAccumulatedVotingPowerStatus === "success" &&
    cycleLength.status === "SUCCESS" &&
    currentAccumulatedVotingPowerData ? (
    formatBalance(
      Number(currentAccumulatedVotingPowerData) / 10 ** 18 / cycleLength.data,
      1
    )
  ) : (
    <Elipsis />
  );
}
