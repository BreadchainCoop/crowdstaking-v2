"use client";

import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { WRAPPER_CLASSES } from "@/app/core/util/classes";
import { Heading2, Body } from "@breadcoop/ui";
import clsx from "clsx";
import { Spinner } from "@/app/core/components/Icons/Spinner";
import { LoginButton } from "@/app/components/login-button";
import { UsernameCard } from "./components/UsernameCard";
import { BreadHoldingsCard } from "./components/BreadHoldingsCard";
import { YieldContributionsCard } from "./components/YieldContributionsCard";
import { VotingHistorySection } from "./components/VotingHistorySection";
import { GnosisPayCard } from "./components/GnosisPayCard";
import { StacksCard } from "./components/StacksCard";

export function ProfilePage() {
  const { user } = useConnectedUser();

  // Loading state
  if (user.status === "LOADING") {
    return (
      <div className="w-full flex flex-col items-center justify-center pt-32">
        <Body className="mb-4 text-surface-grey-2">Loading your profile...</Body>
        <div className="size-10 text-breadgray-grey">
          <Spinner />
        </div>
      </div>
    );
  }

  // Not connected state
  if (user.status === "NOT_CONNECTED" || user.status === "UNSUPPORTED_CHAIN") {
    return (
      <div className="w-full flex flex-col items-center justify-center pt-32">
        <Heading2 className="text-2xl mb-4">My Profile</Heading2>
        <Body className="mb-6 text-surface-grey-2 text-center max-w-md">
          {user.status === "NOT_CONNECTED"
            ? "Connect your wallet to view your profile"
            : "Please switch to Gnosis Chain to view your profile"}
        </Body>
        <div className="max-w-xs w-full">
          <LoginButton user={user} label={user.status === "NOT_CONNECTED" ? "Connect Wallet" : "Switch Network"} />
        </div>
      </div>
    );
  }

  // Connected state
  return (
    <section className={clsx("grow pb-16", WRAPPER_CLASSES)}>
      {/* Page Header */}
      <div className="mb-8">
        <Heading2 className="text-3xl mb-2">My Profile</Heading2>
        <Body className="text-surface-grey-2">
          View your BREAD holdings, yield, and activity
        </Body>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Username Card - Full width on mobile, first position on desktop */}
        <div className="lg:col-span-2">
          <UsernameCard />
        </div>

        {/* BREAD Overview (includes LP position) */}
        <BreadHoldingsCard />

        {/* Yield Contributions - Right column */}
        <YieldContributionsCard />

        {/* Gnosis Pay Card - Left column */}
        <GnosisPayCard />

        {/* Stacks Card (feature-flagged) */}
        {user.features.stacks && <StacksCard />}
      </div>

      {/* Voting History Section - Full width */}
      {user.features.votingHistory && <VotingHistorySection />}
    </section>
  );
}
