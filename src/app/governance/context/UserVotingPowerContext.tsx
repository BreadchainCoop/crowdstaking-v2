import { createContext, ReactNode, useContext } from "react";

import {
  TVotingPowerState,
  VotingPowerContext,
  VotingPowerProvider,
} from "./VotingPowerContext";
import { useConnectedUser } from "@/app/core/hooks/useConnectedUser";
import { usePreviousCycleStartingBlock } from "../usePreviousCycleStartingBlock";
import { useLastClaimedBlockNumber } from "../useLastClaimedBlockNumber";

const UserVotingPowerContext = createContext<TVotingPowerState>(null);

export function UserVotingPowerProvider({ children }: { children: ReactNode }) {
  const { user } = useConnectedUser();

  const { lastClaimedBlocknumber } = useLastClaimedBlockNumber();
  const { data: previousCycleStartingBlockData } =
    usePreviousCycleStartingBlock();

  if (
    user.status === "CONNECTED" &&
    previousCycleStartingBlockData &&
    lastClaimedBlocknumber
  ) {
    return (
      <VotingPowerProvider
        account={user.address}
        previousCycleStartingBlock={previousCycleStartingBlockData}
        lastClaimedBlocknumber={lastClaimedBlocknumber}
      >
        {children}
      </VotingPowerProvider>
    );
  }

  return (
    <VotingPowerContext.Provider value={null}>
      {children}
    </VotingPowerContext.Provider>
  );
}

export function useUserVotingPower() {
  const context = useContext(UserVotingPowerContext);
  if (context === undefined) {
    throw new Error(
      "useUserVotingPower must be used within a UserVotingPowerProvider"
    );
  }
  return context;
}
