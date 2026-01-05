"use client";

import { Body, Heading5, Caption, LiftedButton, Logo } from "@breadcoop/ui";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useUserVotingHistoryByCycle } from "@/app/governance/useUserVotingHistoryByCycle";
import { useDistributions } from "@/app/governance/useDistributions";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import { projectsMeta } from "@/app/projectsMeta";
import { format, parse } from "date-fns";
import { Hex, formatUnits } from "viem";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { formatBalance } from "@/app/core/util/formatter";

/**
 * UserVotingHistory Component
 *
 * Displays the voting history for the connected user grouped by cycle
 * Shows only the last vote per cycle (in case user recast their vote)
 * Allows cycling through vote history similar to governance page
 */
export function UserVotingHistory() {
  const { user } = useConnectedUser();
  const userAddress = user.status === "CONNECTED" ? user.address : undefined;
  const { data: votingHistory, isLoading } = useUserVotingHistoryByCycle(userAddress);
  const [cycleIndex, setCycleIndex] = useState(0); // 0 returns the latest vote

  // Calculate cycle index for distribution (must be called before early returns)
  const currentVoteCycle = votingHistory?.[cycleIndex];
  const cycleIndexForDistribution = votingHistory && currentVoteCycle
    ? votingHistory.length - currentVoteCycle.cycleNumber
    : 0;
  const { cycleDistribution: currentCycleDistribution } = useDistributions(cycleIndexForDistribution);

  if (!userAddress) {
    return (
      <div className="bg-paper-1 p-6 text-center">
        <Body className="text-surface-grey-2">
          Connect your wallet to view your voting history
        </Body>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col p-6">
        <Body className="mb-2">Loading your voting history...</Body>
        <Spinner />
      </div>
    );
  }

  if (!votingHistory || votingHistory.length === 0 || !currentVoteCycle) {
    return (
      <div className="bg-paper-1 p-6 text-center">
        <Body className="text-surface-grey-2">
          You haven&apos;t cast any votes yet
        </Body>
      </div>
    );
  }

  const totalCycles = votingHistory.length;

  const updateCycleIndex = (delta: number) => {
    setCycleIndex((prev) => {
      let newIndex = prev + delta;
      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex >= totalCycles) {
        newIndex = totalCycles - 1;
      }
      return newIndex;
    });
  };

  return (
    <div className="space-y-4">
      {/* Navigation Controls */}
      <div className="bg-paper-1 p-4 border border-paper-2">
        <div className="flex items-center justify-between">
          <Caption className="text-surface-grey">
            {format(new Date(currentVoteCycle.vote.timestamp * 1000), "MMM d, yyyy")}
          </Caption>
          <div className="flex items-center gap-3">
            <LiftedButton
              preset="stroke"
              onClick={() => {
                if (cycleIndex === totalCycles - 1) return;
                updateCycleIndex(1);
              }}
              disabled={cycleIndex === totalCycles - 1}
              className="h-[32px] w-[32px] p-0"
            >
              <ArrowLeftIcon size={20} className="text-primary-orange" />
            </LiftedButton>
            <Body bold className="text-[20px]">
              Cycle #{currentVoteCycle.cycleNumber}
            </Body>
            <LiftedButton
              preset="stroke"
              onClick={() => {
                if (cycleIndex === 0) return;
                updateCycleIndex(-1);
              }}
              disabled={cycleIndex === 0}
              className="h-[32px] w-[32px] p-0"
            >
              <ArrowRightIcon size={20} className="text-primary-orange" />
            </LiftedButton>
          </div>
        </div>
        {/* Total Distributed */}
        {currentCycleDistribution && (
          <div className="mt-3 pt-3 border-t border-paper-2 flex items-center gap-2">
            <Caption className="text-surface-grey-2 text-xs">
              Total Distributed:
            </Caption>
            <div className="flex items-center gap-1">
              <span className="flex items-center">
                <Logo size={16} />
              </span>
              <Body className="text-sm font-bold">
                {formatBalance(Number(formatUnits(BigInt(currentCycleDistribution.totalYield), 18)), 2)}
              </Body>
            </div>
          </div>
        )}
      </div>

      {/* Projects List */}
      <VoteProjectsList
        vote={currentVoteCycle.vote}
        cycleNumber={currentVoteCycle.cycleNumber}
      />
    </div>
  );
}

interface VoteProjectsListProps {
  vote: {
    timestamp: number;
    transactionHash: string;
    votes: Array<{
      projectAddress: Hex;
      points: number;
      percentage: number;
    }>;
  };
  cycleNumber: number;
}

function VoteProjectsList({ vote, cycleNumber }: VoteProjectsListProps) {
  // Get the actual cycle distribution data to know which projects existed in this cycle
  // We need to calculate the cycleIndex from cycleNumber
  // cycleIndex 0 = most recent cycle, so we need to reverse the mapping
  const { cycleDistribution, totalDistributions } = useDistributions();

  // Calculate the correct index for this cycle
  // If totalDistributions is 10 and we want cycle 10, index should be 0
  // If totalDistributions is 10 and we want cycle 9, index should be 1
  const cycleIndexForDistribution = totalDistributions ? totalDistributions - cycleNumber : 0;
  const { cycleDistribution: specificCycleDistribution } = useDistributions(cycleIndexForDistribution);

  // If we don't have the cycle distribution data yet, show loading
  if (!specificCycleDistribution) {
    return (
      <div className="bg-paper-1 p-6 text-center">
        <Spinner />
      </div>
    );
  }

  // Calculate total votes and democratic pool for yield calculations
  const totalYield = Number(formatUnits(BigInt(specificCycleDistribution.totalYield), 18));
  const democraticPool = totalYield / 2; // 50% goes to democratic distribution

  // Calculate total votes by summing all project distribution votes
  const totalVotes = vote.votes.reduce((sum, v) => sum + v.points, 0);

  // Get projects that existed in this specific cycle from the distribution data
  const cycleProjects = specificCycleDistribution.projectDistributions.map(
    (pd) => pd.projectAddress
  );

  // Create a map of voted projects for quick lookup
  const votedProjectsMap = new Map(
    vote.votes.map((v) => [v.projectAddress.toLowerCase(), v])
  );

  // Combine cycle projects with vote data and calculate yield impact
  const allProjectsWithVotes = cycleProjects.map((projectAddress) => {
    const votedProject = votedProjectsMap.get(projectAddress.toLowerCase());
    const points = votedProject?.points || 0;
    const percentage = votedProject?.percentage || 0;

    // Calculate yield influenced by user for this project
    // Formula: (user's vote points / total votes) × democratic pool
    const yieldInfluenced = totalVotes > 0 ? (points / totalVotes) * democraticPool : 0;

    return {
      projectAddress,
      percentage,
      points,
      yieldInfluenced,
    };
  });

  // Sort by percentage descending
  const sortedProjects = allProjectsWithVotes.sort(
    (a, b) => b.percentage - a.percentage
  );

  return (
    <div className="bg-paper-1 border border-paper-2 min-h-[400px] max-h-[600px] overflow-y-auto">
      {sortedProjects.map((project) => {
        const meta = projectsMeta[project.projectAddress];
        if (!meta) return null;

        return (
          <div
            key={project.projectAddress}
            className="flex items-center justify-between p-4 border-b border-paper-2 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center bg-paper-0 border border-paper-2">
                <img
                  src={meta.logoSrc}
                  className="w-[1.2rem] h-[1.2rem]"
                  alt={`${meta.name}'s logo`}
                  width={19.2}
                  height={19.2}
                />
              </div>
              <Body className="text-surface-grey">{meta.name}</Body>
            </div>
            <div className="flex items-center gap-3">
              <Heading5
                className={`font-bold ${
                  project.percentage > 0 ? "text-primary-orange" : "text-surface-grey-2"
                }`}
              >
                {project.percentage.toFixed(1)}%
              </Heading5>
              {project.yieldInfluenced > 0 && (
                <div className="flex items-center gap-1">
                  <span className="flex items-center opacity-70">
                    <Logo size={16} />
                  </span>
                  <Caption className="text-xs text-surface-grey-2">
                    {formatBalance(project.yieldInfluenced, 2)}
                  </Caption>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
