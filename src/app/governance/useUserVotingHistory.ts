import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { Address, Hex } from "viem";
import { SUBGRAPH_QUERY_URL } from "@/constants";

interface BreadHolderVotedEvent {
  id: string;
  account: Address;
  blockTimestamp: string;
  transactionHash: string;
  points: string[];
  projects: Address[];
}

interface QueryResponse {
  breadHolderVoteds: BreadHolderVotedEvent[];
}

export interface UserVote {
  timestamp: number;
  transactionHash: string;
  votes: Array<{
    projectAddress: Hex;
    points: number;
    percentage: number;
  }>;
}

export function useUserVotingHistory(userAddress: Address | undefined) {
  const API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;
  const client = new GraphQLClient(SUBGRAPH_QUERY_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return useQuery<UserVote[]>({
    queryKey: ["userVotingHistory", userAddress],
    enabled: !!userAddress,
    async queryFn() {
      if (!userAddress) return [];

      const response = await client.request<QueryResponse>(`
        query {
          breadHolderVoteds(
            where: { account: "${userAddress.toLowerCase()}" }
            orderBy: blockTimestamp
            orderDirection: desc
          ) {
            id
            account
            blockTimestamp
            transactionHash
            points
            projects
          }
        }
      `);

      // Transform the data into a more usable format
      return response.breadHolderVoteds.map((vote) => {
        const totalPoints = vote.points.reduce(
          (acc, p) => acc + BigInt(p),
          BigInt(0)
        );

        const votes = vote.projects.map((project, index) => {
          const points = Number(vote.points[index]);
          const percentage = totalPoints > 0
            ? (Number(vote.points[index]) / Number(totalPoints)) * 100
            : 0;

          return {
            projectAddress: project as Hex,
            points,
            percentage,
          };
        });

        return {
          timestamp: Number(vote.blockTimestamp),
          transactionHash: vote.transactionHash,
          votes: votes.filter((v) => v.points > 0), // Only include projects with actual votes
        };
      });
    },
  });
}
