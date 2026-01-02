"use client";

import { Body, Heading5, Caption, LiftedButton } from "@breadcoop/ui";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useUserVotingHistory } from "@/app/governance/useUserVotingHistory";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import { projectsMeta } from "@/app/projectsMeta";
import { format } from "date-fns";
import { Hex } from "viem";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";

/**
 * UserVotingHistory Component
 *
 * Displays the voting history for the connected user
 * Shows all past votes with project names and vote percentages
 * Allows cycling through vote history similar to governance page
 */
export function UserVotingHistory() {
  const { user } = useConnectedUser();
  const userAddress = user.status === "CONNECTED" ? user.address : undefined;
  const { data: votingHistory, isLoading } = useUserVotingHistory(userAddress);
  const [voteIndex, setVoteIndex] = useState(0); // 0 returns the latest vote

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

  if (!votingHistory || votingHistory.length === 0) {
    return (
      <div className="bg-paper-1 p-6 text-center">
        <Body className="text-surface-grey-2">
          You haven&apos;t cast any votes yet
        </Body>
      </div>
    );
  }

  const currentVote = votingHistory[voteIndex];
  const totalVotes = votingHistory.length;

  const updateVoteIndex = (delta: number) => {
    setVoteIndex((prev) => {
      let newIndex = prev + delta;
      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex >= totalVotes) {
        newIndex = totalVotes - 1;
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
            {format(new Date(currentVote.timestamp * 1000), "MMM d, yyyy")}
          </Caption>
          <div className="flex items-center gap-3">
            <LiftedButton
              preset="stroke"
              onClick={() => {
                if (voteIndex === totalVotes - 1) return;
                updateVoteIndex(1);
              }}
              disabled={voteIndex === totalVotes - 1}
              className="h-[32px] w-[32px] p-0"
            >
              <ArrowLeftIcon size={20} className="text-primary-orange" />
            </LiftedButton>
            <Body bold className="text-[20px]">
              Vote {totalVotes - voteIndex} of {totalVotes}
            </Body>
            <LiftedButton
              preset="stroke"
              onClick={() => {
                if (voteIndex === 0) return;
                updateVoteIndex(-1);
              }}
              disabled={voteIndex === 0}
              className="h-[32px] w-[32px] p-0"
            >
              <ArrowRightIcon size={20} className="text-primary-orange" />
            </LiftedButton>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <VoteProjectsList vote={currentVote} />
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
}

function VoteProjectsList({ vote }: VoteProjectsListProps) {
  // Get all active projects
  const allProjects = Object.entries(projectsMeta)
    .filter(([_, meta]) => meta.active)
    .map(([address]) => address as Hex);

  // Create a map of voted projects for quick lookup
  const votedProjectsMap = new Map(
    vote.votes.map((v) => [v.projectAddress.toLowerCase(), v])
  );

  // Combine all projects with vote data
  const allProjectsWithVotes = allProjects.map((projectAddress) => {
    const votedProject = votedProjectsMap.get(projectAddress.toLowerCase());
    return {
      projectAddress,
      percentage: votedProject?.percentage || 0,
      points: votedProject?.points || 0,
    };
  });

  // Sort by percentage descending
  const sortedProjects = allProjectsWithVotes.sort(
    (a, b) => b.percentage - a.percentage
  );

  return (
    <div className="bg-paper-1 border border-paper-2">
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
            <Heading5
              className={`font-bold ${
                project.percentage > 0 ? "text-primary-orange" : "text-surface-grey-2"
              }`}
            >
              {project.percentage.toFixed(1)}%
            </Heading5>
          </div>
        );
      })}
    </div>
  );
}
