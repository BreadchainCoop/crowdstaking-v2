"use client";

import { Heading3 } from "@breadcoop/ui";
import { VotingHistory } from "@/app/governance/components/VotingHistory";

/**
 * VotingHistorySection Component
 *
 * Simple wrapper that reuses the existing VotingHistory component
 * Displays full voting history with cycle navigation
 */
export function VotingHistorySection() {
  return (
    <div className="mt-8">
      <Heading3 className="mb-6">Voting History</Heading3>
      <VotingHistory />
    </div>
  );
}
