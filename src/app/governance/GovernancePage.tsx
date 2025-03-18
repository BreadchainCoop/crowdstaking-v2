"use client";
import { useEffect, useMemo, useState } from "react";
import { Hex } from "viem";

import { ProjectRow, VoteDisplay, VoteForm } from "./components/ProjectRow";
import { CastVotePanel } from "./components/CastVote";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { ResultsPanel } from "./components/ResultsPanel";
import { useCurrentVotingDistribution } from "./useCurrentVotingDistribution";
import { useCastVote } from "./useCastVote";
import { DistributionOverview } from "./components/DistributionOverview";
import { VotingPower } from "./components/VotingPower";
import { useLastClaimedBlockNumber } from "./useLastClaimedBlockNumber";
import { useCycleLength } from "./useCycleLength";
import { Spinner } from "../core/components/Icons/Spinner";
import { useCycleDates } from "./useCycleDates";
import { useMinRequiredVotingPower } from "./useMinRequiredVotingPower";
import { InfoCallout } from "./components/InfoCallout";
import { useDistributions } from "./useDistributions";
import { useModal } from "../core/context/ModalContext";
import { projectsMeta } from "../projectsMeta";
import { PageGrid } from "./components/PageGrid";
import { ProjectsProvider } from "@/app/core/context/ProjectContext/ProjectContext";
import { useVotingPower } from "./context/VotingPowerContext";
import { useIsMobile } from "@/app/core/hooks/useIsMobile";
import {
  VotingHistoryMobile,
  VotingHistoryDesktop,
} from "./components/VotingHistory";

export function GovernancePage() {
  const { user, isSafe } = useConnectedUser();
  const { currentVotingDistribution } = useCurrentVotingDistribution();
  const { lastClaimedBlocknumber } = useLastClaimedBlockNumber();
  const { cycleLength } = useCycleLength();
  const { castVote } = useCastVote(user, lastClaimedBlocknumber);
  const { minRequiredVotingPower } = useMinRequiredVotingPower();
  const { data: distributionsData } = useDistributions();
  const isMobile = useIsMobile();

  const userVotingPower = useVotingPower();

  const { cycleDates } = useCycleDates(cycleLength);

  const [voteFormState, setVoteFormState] = useState<null | {
    projects: { [key: Hex]: number };
    totalPoints: number;
  }>(null);
  const [isRecasting, setIsRecasting] = useState<boolean>(false);

  const { modalState, setModal } = useModal();

  useEffect(() => {
    if (modalState?.type === "CONFIRM_RECAST" && modalState.isConfirmed) {
      setModal(null);
      setIsRecasting(true);
    }
  }, [modalState, setModal]);

  useEffect(() => {
    if (
      castVote.status === "ERROR" ||
      currentVotingDistribution.status === "ERROR" ||
      cycleDates.status === "ERROR" ||
      cycleLength.status === "ERROR"
    ) {
      const errorVars = [];

      if (castVote.status === "ERROR") errorVars.push("castVote");
      if (currentVotingDistribution.status === "ERROR")
        errorVars.push("currentVotingDistribution");
      if (cycleDates.status === "ERROR") errorVars.push("cycleDates");
      if (cycleLength.status === "ERROR") errorVars.push("cycleLength");

      if (errorVars.length > 0) {
        console.log("Error status in: ", errorVars.join(", "));
      }
    }
  }, [castVote, currentVotingDistribution, cycleDates, cycleLength]);

  useEffect(() => {
    if (voteFormState?.projects) return;
    if (
      currentVotingDistribution.status === "SUCCESS" &&
      castVote.status === "SUCCESS"
    ) {
      const projects = castVote.data
        ? { ...castVote.data }
        : currentVotingDistribution.data[0].reduce<{
            [key: Hex]: number;
          }>((acc, cur, i) => {
            acc[cur] = 0;
            return acc;
          }, {});
      setVoteFormState({
        projects,
        totalPoints: 0,
      });
    }
  }, [currentVotingDistribution, voteFormState, castVote]);

  function resetFormState() {
    if (
      castVote.status !== "SUCCESS" ||
      currentVotingDistribution.status !== "SUCCESS"
    )
      return;

    setVoteFormState({
      projects: castVote.data
        ? { ...castVote.data }
        : currentVotingDistribution.data[0].reduce<{
            [key: Hex]: number;
          }>((acc, cur, i) => {
            acc[cur] = 0;
            return acc;
          }, {}),
      totalPoints: 0,
    });
  }

  function updateValue(value: number, account: Hex) {
    setVoteFormState((state) => {
      if (!state) return state;
      const newState = { ...state };
      newState.projects[account] = value;
      newState.totalPoints = Object.keys(newState.projects).reduce(
        (acc, cur) => acc + newState.projects[cur as Hex],
        0
      );
      return newState;
    });
  }

  function distributeEqually() {
    setVoteFormState((state) => {
      console.log({ state });
      if (!state) return state;
      const newState = { ...state };
      newState.projects = Object.keys(newState.projects).reduce<{
        [key: Hex]: number;
      }>((acc, cur) => {
        acc[cur as Hex] = 1;
        return acc;
      }, {});
      newState.totalPoints = Object.keys(newState.projects).length;
      return newState;
    });
  }

  const castTotalPoints =
    castVote.status === "SUCCESS" && castVote.data
      ? Object.keys(castVote.data).reduce(
          (acc, cur) => acc + castVote.data![cur as Hex],
          0
        )
      : 0;

  const userHasVoted = useMemo(() => {
    return castVote.status === "SUCCESS" && castVote.data ? true : false;
  }, [castVote]);

  const { userCanVote, totalUserVotingPower } = useMemo(() => {
    const totalUserVotingPower =
      userVotingPower &&
      userVotingPower.bread.status === "success" &&
      userVotingPower.butteredBread.status === "success"
        ? userVotingPower.bread.value + userVotingPower.butteredBread.value
        : null;

    const userCanVote =
      totalUserVotingPower &&
      totalUserVotingPower > Number(minRequiredVotingPower || 0)
        ? true
        : false;

    return { userCanVote, totalUserVotingPower };
  }, [minRequiredVotingPower, userVotingPower]);

  if (
    castVote.status === "ERROR" ||
    currentVotingDistribution.status === "ERROR" ||
    cycleDates.status === "ERROR" ||
    cycleLength.status === "ERROR"
  )
    return (
      <div className="w-full flex flex-col items-center pt-32">
        <h1>Please wait...</h1>
        <div className="mt-6 size-10 text-breadgray-grey">
          <Spinner />
        </div>
      </div>
    );

  if (
    !voteFormState ||
    castVote.status === "LOADING" ||
    currentVotingDistribution.status === "LOADING" ||
    cycleDates.status === "LOADING" ||
    cycleLength.status === "LOADING"
  )
    return (
      <div className="w-full flex justify-center pt-32">
        <div className="size-10 text-breadgray-grey">
          <Spinner />
        </div>
      </div>
    );

  return (
    <>
      <section className="grow w-full max-w-[44rem] lg:max-w-[67rem] m-auto pb-16 px-4 lg:px-8">
        <PageGrid>
          <div className="col-span-12 lg:col-span-8 row-start-1 row-span-1">
            <h3 className="text-3xl font-bold text-breadgray-grey100 dark:text-breadgray-ultra-white">
              Bread Governance
            </h3>
            <p className="pt-4 text-lg max-w-xl text-breadgray-rye dark:text-breadgray-light-grey">
              Distribute your voting power across the various projects in the
              Breadchain Network to influence how much yield is given to each.
              The actual distribution will be made at the end of the month based
              on all votes received.
            </p>
          </div>

          <DistributionOverview
            cycleDates={cycleDates}
            distributions={distributionsData}
          />

          <div className="max-w-md m-auto col-span-12 row-start-3 row-span-1 lg:row-start-3 lg:col-start-9 lg:col-span-4 h-full flex flex-col gap-4">
            <ResultsPanel distribution={currentVotingDistribution} />
            <InfoCallout />
          </div>

          <div className="col-span-12 row-start-4 lg:col-start-1 lg:col-span-8 lg:row-start-2">
            <VotingPower
              minRequiredVotingPower={minRequiredVotingPower}
              userVotingPower={totalUserVotingPower}
              userHasVoted={userHasVoted}
              cycleDates={cycleDates}
              cycleLength={cycleLength}
              userCanVote={userCanVote}
              user={user}
              distributeEqually={distributeEqually}
              isRecasting={isRecasting}
            />
          </div>
          <div className="col-span-12 row-start-5 lg:col-start-1 lg:col-span-8 lg:row-start-3 grid grid-cols-1 gap-3">
            {currentVotingDistribution.data[0]
              .map((account, i) => ({
                account,
                castPoints: currentVotingDistribution.data[1][i],
              }))
              .toSorted((a, b) => {
                return (
                  projectsMeta[a.account].order - projectsMeta[b.account].order
                );
              })
              .map((project, i) => {
                return (
                  <div key={`project_row_${project.account}`}>
                    <ProjectsProvider
                      cycleLength={cycleLength.data}
                      address={project.account}
                    >
                      <ProjectRow address={project.account}>
                        {!isRecasting && castVote.data ? (
                          <VoteDisplay
                            points={castVote.data[project.account]}
                            percentage={
                              (castVote.data[project.account] /
                                castTotalPoints) *
                                100 || 0
                            }
                          />
                        ) : (
                          <VoteForm
                            value={voteFormState.projects[project.account]}
                            updateValue={updateValue}
                            address={project.account}
                            totalPoints={voteFormState.totalPoints}
                            user={user}
                            userCanVote={userCanVote}
                          />
                        )}
                      </ProjectRow>
                    </ProjectsProvider>
                  </div>
                );
              })}
            <CastVotePanel
              user={user}
              userVote={Object.keys(voteFormState.projects).map(
                (account) => voteFormState.projects[account as Hex]
              )}
              userHasVoted={userHasVoted}
              userCanVote={userCanVote}
              isSafe={isSafe}
              isRecasting={isRecasting}
              setIsRecasting={setIsRecasting}
              resetFormState={resetFormState}
            />
          </div>
        </PageGrid>
        {/* <Diagnostics /> */}
      </section>
      <section className="grow w-full max-w-[44rem] lg:max-w-[67rem] m-auto pb-16 px-4 lg:px-8">
        <PageGrid>
          <div className="col-span-12 row-start-1 row-span-1">
            {isMobile ? <VotingHistoryMobile /> : <VotingHistoryDesktop />}
          </div>
        </PageGrid>
      </section>
    </>
  );
}
