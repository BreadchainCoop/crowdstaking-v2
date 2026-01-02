"use client";

import { Body, Heading5, Caption } from "@breadcoop/ui";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useUserVotingHistory } from "@/app/governance/useUserVotingHistory";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import { projectsMeta } from "@/app/projectsMeta";
import { format } from "date-fns";
import { Hex } from "viem";

/**
 * UserVotingHistory Component
 *
 * Displays the voting history for the connected user
 * Shows all past votes with project names and vote percentages
 */
export function UserVotingHistory() {
  const { user } = useConnectedUser();
  const userAddress = user.status === "CONNECTED" ? user.address : undefined;
  const { data: votingHistory, isLoading } = useUserVotingHistory(userAddress);

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
          You haven't cast any votes yet
        </Body>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {votingHistory.map((vote, index) => (
        <VoteCard key={vote.transactionHash} vote={vote} isRecent={index === 0} />
      ))}
    </div>
  );
}

interface VoteCardProps {
  vote: {
    timestamp: number;
    transactionHash: string;
    votes: Array<{
      projectAddress: Hex;
      points: number;
      percentage: number;
    }>;
  };
  isRecent: boolean;
}

function VoteCard({ vote, isRecent }: VoteCardProps) {
  const date = new Date(vote.timestamp * 1000);
  const formattedDate = format(date, "MMM d, yyyy");

  return (
    <div className="bg-paper-1 p-4 border border-paper-2">
      <div className="flex items-center justify-between mb-3">
        <Caption className="text-surface-grey">
          {formattedDate}
          {isRecent && (
            <span className="ml-2 text-xs text-primary-orange font-bold">
              • Most Recent
            </span>
          )}
        </Caption>
      </div>

      <div className="space-y-2">
        {vote.votes.map((v) => {
          const meta = projectsMeta[v.projectAddress];
          if (!meta) return null;

          return (
            <div
              key={v.projectAddress}
              className="flex items-center justify-between py-2 border-b border-paper-2 last:border-b-0"
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
              <Heading5 className="font-bold text-primary-orange">
                {v.percentage.toFixed(1)}%
              </Heading5>
            </div>
          );
        })}
      </div>
    </div>
  );
}
