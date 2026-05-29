import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { Address, getAddress, Hex } from "viem";
import { SUBGRAPH_QUERY_URL } from "@/constants";

/**
 * Shape of a `BreadHolderVoted` entity as indexed by the Breadchain subgraph.
 * Mirrors `type BreadHolderVoted` in BreadchainCoop/subgraph `schema.graphql`.
 */
interface BreadHolderVotedEntity {
  id: string;
  account: Address;
  points: Array<string>;
  projects: Array<Address>;
  timestamp: string;
  blockNumber: string;
  transactionHash: Hex;
}

interface QueryResponse {
  breadHolderVoteds: BreadHolderVotedEntity[];
}

/** A single governance vote cast by a wallet, parsed into JS-friendly types. */
export interface UserVote {
  id: string;
  /** Unix timestamp (ms) the vote was cast. */
  timestamp: number;
  blockNumber: number;
  transactionHash: Hex;
  /** Project addresses the points were allocated across. */
  projects: Array<Address>;
  /** Points allocated to each project (index-aligned with `projects`). */
  points: Array<number>;
}

export interface UserVoteCount {
  /** Total number of votes the wallet has cast across all cycles. */
  totalVotes: number;
  /** Parsed vote events, ordered most-recent first. */
  votes: Array<UserVote>;
  /** Transaction hashes of every vote, ordered most-recent first. */
  transactionHashes: Array<Hex>;
}

const EMPTY: UserVoteCount = {
  totalVotes: 0,
  votes: [],
  transactionHashes: [],
};

const USER_VOTES_QUERY = `
  query UserVotes($account: Bytes!) {
    breadHolderVoteds(
      where: { account: $account }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      account
      points
      projects
      timestamp
      blockNumber
      transactionHash
    }
  }
`;

/**
 * Fetches the total number of governance votes a wallet has cast, along with
 * useful metadata (transaction hashes, the projects/points of each vote, and
 * the block/timestamp it was cast at).
 *
 * Queries the Breadchain subgraph for all `BreadHolderVoted` events emitted by
 * the given `address`. Follows the same GraphQL pattern as `useDistributions`.
 *
 * @param address Wallet to look up. The query is disabled while undefined.
 */
export function useUserVoteCount(address?: Address) {
  const API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;

  const query = useQuery<QueryResponse>({
    placeholderData: keepPreviousData,
    queryKey: ["userVoteCount", address?.toLowerCase()],
    enabled: Boolean(address),
    async queryFn() {
      const client = new GraphQLClient(SUBGRAPH_QUERY_URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      // Subgraph stores addresses lower-cased; `Bytes` filters are exact-match.
      return await client.request(USER_VOTES_QUERY, {
        account: address?.toLowerCase(),
      });
    },
  });

  const votes: Array<UserVote> = (query.data?.breadHolderVoteds ?? []).map(
    (event) => ({
      id: event.id,
      timestamp: Number(event.timestamp) * 1000,
      blockNumber: Number(event.blockNumber),
      transactionHash: event.transactionHash,
      projects: event.projects.map((project) => getAddress(project)),
      points: event.points.map((points) => Number(points)),
    })
  );

  const data: UserVoteCount = query.data
    ? {
        totalVotes: votes.length,
        votes,
        transactionHashes: votes.map((vote) => vote.transactionHash),
      }
    : EMPTY;

  return {
    /** Parsed, aggregated vote data (never null — defaults to empty). */
    data,
    /** Convenience alias for `data.totalVotes`. */
    totalVotes: data.totalVotes,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
