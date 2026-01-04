import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { formatUnits } from "viem";
import { SUBGRAPH_QUERY_URL } from "@/constants";

interface YieldDistribution {
  yield: string;
  timestamp: string;
}

interface YieldDistributionsResponse {
  yieldDistributeds: YieldDistribution[];
}

/**
 * Calculate the total yield that has been distributed across all cycles
 * This represents the total yield generated from all BREAD holders' collateral
 */
export function useTotalYieldGenerated() {
  const API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;
  const client = new GraphQLClient(SUBGRAPH_QUERY_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  return useQuery<number>({
    queryKey: ["totalYieldGenerated"],
    async queryFn() {
      const response = await client.request<YieldDistributionsResponse>(`
        query {
          yieldDistributeds(orderBy: timestamp, orderDirection: desc) {
            yield
            timestamp
          }
        }
      `);

      // Sum up all yield from all distributions
      const totalYield = response.yieldDistributeds.reduce((sum, dist) => {
        const yieldAmount = Number(formatUnits(BigInt(dist.yield), 18));
        return sum + yieldAmount;
      }, 0);

      return totalYield;
    },
  });
}
