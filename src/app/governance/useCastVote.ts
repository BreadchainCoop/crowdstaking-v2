import { useEffect, useState } from "react";
import { TConnectedUserState } from "../core/hooks/useConnectedUser";
import { ParsedVote, useCurrentVotes } from "./useCurrentVotes";
import { Hex } from "viem";

export type CastVoteData = { [key: Hex]: number };
export type CastVoteStatusLoading = { status: "LOADING" };
export type CastVoteStatusSuccess = {
  status: "SUCCESS";
  data: CastVoteData | null;
};
export type CastVoteStatusError = { status: "ERROR" };

export type CastVoteState =
  | CastVoteStatusLoading
  | CastVoteStatusSuccess
  | CastVoteStatusError;

export function useCastVote(
  user: TConnectedUserState,
  lastClaimedBlockNumber: bigint | null
) {
  const [castVote, setCastVote] = useState<CastVoteState>({
    status: "LOADING",
  });

  const userAddress = user.status === "CONNECTED" ? user.address : "";

  const { data: votesData } = useCurrentVotes(lastClaimedBlockNumber);

  useEffect(() => {
    if (votesData) {
      const mostRecentVote = votesData.reduce<null | ParsedVote>(
        (acc, vote) => {
          if (vote.account !== userAddress) return acc;
          if (!acc) return vote;
          if ((acc.blockTimestamp = vote.blockTimestamp)) return vote;
          return vote.blockTimestamp > acc.blockTimestamp ? vote : acc;
        },
        null
      );
      setCastVote({
        status: "SUCCESS",
        data: mostRecentVote
          ? mostRecentVote.points.reduce<CastVoteData>((acc, curr, i) => {
              acc[mostRecentVote.projects[i]] = curr;
              return acc;
            }, {})
          : null,
      });
    }
  }, [votesData, userAddress]);

  return { castVote };
}
