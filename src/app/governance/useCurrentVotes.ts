import { useQuery } from "@tanstack/react-query";
import { getAddress, Hex } from "viem";
import { GraphQLClient } from "graphql-request";
import { SUBGRAPH_QUERY_URL } from "@/constants";

interface BreadHolderVoted {
  id: string;
  account: Hex;
  points: Array<string>;
  projects: Array<Hex>;
  timestamp: string;
  blockNumber: string;
}

interface QueryResponse {
  breadHolderVoteds: BreadHolderVoted[];
}

export function useCurrentVotes(lastClaimedBlockNumber: bigint | null) {
  const client = new GraphQLClient(SUBGRAPH_QUERY_URL, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY}`,
    },
  });

  return useQuery({
    queryKey: ["getVotesForCurrentRound"],
    refetchInterval: 500,
    enabled: !!lastClaimedBlockNumber,
    queryFn: async () => {
      const data = await client.request<QueryResponse>(`
        query {
          breadHolderVoteds(
            where: { blockNumber_gte: "${lastClaimedBlockNumber}" }
          ) {
            id
            account
            points
            projects
            timestamp
            blockNumber
          }
        }
      `);

      const parsed = data.breadHolderVoteds.map(parseVoteFromSubgraph);
      return parsed;
    },
  });
}

export type ParsedVote = {
  account: Hex;
  blockTimestamp: number;
  points: number[];
  projects: Hex[];
};

function parseVoteFromSubgraph(vote: BreadHolderVoted): ParsedVote {
  return {
    account: getAddress(vote.account),
    blockTimestamp: Number(vote.timestamp) * 1000,
    points: vote.points.map(Number),
    projects: vote.projects.map(p => getAddress(p)),
  };
}

function pointsToPermyraid(points: Array<number>) {
  const total = points.reduce((acc, num) => acc + num, 0);
  return points.map((p) => Math.floor((p * 10000) / total));
}
