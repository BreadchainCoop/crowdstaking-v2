"use client";

import { Heading3 } from "@breadcoop/ui";
import { UserVotingHistory } from "./UserVotingHistory";

/**
 * VotingHistorySection Component
 *
 * Displays the user's personal voting history
 * Shows all past votes cast by the connected user
 */
export function VotingHistorySection() {
  return (
    <div className="mt-8">
      <Heading3 className="mb-6">Your Voting History</Heading3>
      <UserVotingHistory />
    </div>
  );
}
