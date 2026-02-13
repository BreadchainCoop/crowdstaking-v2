"use client";

import { Heading3, Body, Caption, Logo } from "@breadcoop/ui";
import { CardBox } from "@/app/core/components/CardBox";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { useUserVotingHistoryByCycle } from "@/app/governance/useUserVotingHistoryByCycle";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import { projectsMeta } from "@/app/projectsMeta";
import { formatBalance } from "@/app/core/util/formatter";
import { useUserTotalYieldInfluenced } from "../hooks/useUserTotalYieldInfluenced";

/**
 * YieldContributionsCard Component
 *
 * Shows the total yield a user has helped distribute to each project
 * across all their voting history
 */
export function YieldContributionsCard() {
  const { user } = useConnectedUser();
  const userAddress = user.status === "CONNECTED" ? user.address : undefined;
  const { data: yieldData, isLoading } = useUserTotalYieldInfluenced(userAddress);
  const { data: votingHistory, isLoading: votingHistoryLoading } = useUserVotingHistoryByCycle(userAddress);

  if (!userAddress) {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">Yield Impact</Heading3>
        <Body className="text-surface-grey-2 text-center py-4">
          Connect wallet to view your yield contributions
        </Body>
      </CardBox>
    );
  }

  if (isLoading || votingHistoryLoading) {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">Yield Impact</Heading3>
        <div className="flex justify-center py-8">
          <div className="size-8 text-breadgray-grey">
            <Spinner />
          </div>
        </div>
      </CardBox>
    );
  }

  // Check if user has voted
  const hasVotingHistory = votingHistory && votingHistory.length > 0;
  const hasYieldData = yieldData && yieldData.total > 0;

  if (!hasVotingHistory) {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">Yield Impact</Heading3>
        <Body className="text-surface-grey-2 text-center py-4">
          Vote to start contributing yield to projects
        </Body>
      </CardBox>
    );
  }

  if (!hasYieldData) {
    return (
      <CardBox className="p-6">
        <Heading3 className="mb-4">Yield Impact</Heading3>
        <Body className="text-surface-grey-2 text-center py-4">
          Your votes will contribute to yield distribution in the next cycle
        </Body>
      </CardBox>
    );
  }

  const totalYieldContributed = yieldData.total;
  const projectBreakdown = Object.values(yieldData.byProject);

  return (
    <CardBox className="p-6 h-full flex flex-col">
      <Heading3 className="mb-4">Yield Impact</Heading3>

      {/* Total Yield Influenced Through Voting */}
      <div className="text-center py-4 mb-4 bg-paper-2 border border-paper-1">
        <Caption className="text-surface-grey-2 block text-xs mb-2">
          Total Yield Influenced Through Voting
        </Caption>
        <div className="flex items-center justify-center gap-2">
          <Logo size={24} />
          <Body className="text-2xl font-bold">
            {formatBalance(totalYieldContributed, 2)}
          </Body>
        </div>
      </div>

      {/* Per-Project Breakdown */}
      <div className="space-y-1 flex-1 overflow-y-auto">
        <Caption className="text-surface-grey-2 block text-xs mb-2">
          Breakdown by Project
        </Caption>
        {projectBreakdown
          .sort((a, b) => b.amount - a.amount)
          .map((contribution) => {
            const meta = projectsMeta[contribution.projectAddress as `0x${string}`];
            if (!meta) return null;

            return (
              <div
                key={contribution.projectAddress}
                className="flex items-center justify-between p-3 bg-paper-0 border border-paper-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center bg-paper-0 border border-paper-2">
                    <img
                      src={meta.logoSrc}
                      className="w-[1.2rem] h-[1.2rem]"
                      alt={`${meta.name}'s logo`}
                      width={19.2}
                      height={19.2}
                    />
                  </div>
                  <Body className="text-surface-grey text-sm">{meta.name}</Body>
                </div>
                <div className="flex items-center gap-1">
                  <Logo size={16} />
                  <Body className="font-bold text-sm">
                    {formatBalance(contribution.amount, 2)}
                  </Body>
                </div>
              </div>
            );
          })}
      </div>

      <Caption className="text-surface-grey-2 text-center block text-xs mt-4 opacity-70">
        Based on your voting power across all cycles
      </Caption>
    </CardBox>
  );
}
