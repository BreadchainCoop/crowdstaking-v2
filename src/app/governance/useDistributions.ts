import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { formatUnits } from "viem";
import { projectsMeta } from "@/app/projectsMeta";
import { Hex } from "viem";
import { SUBGRAPH_QUERY_URL } from "@/constants";

interface YieldDistribution {
  id: string;
  yield: string;
  totalVotes: string;
  timestamp: string;
  projectDistributions: Array<string>;
}

interface QueryResponse {
  yieldDistributeds: YieldDistribution[];
}

interface CycleDistribution {
  cycleNumber: number;
  totalYield: number;
  distributionDate: string;
  projectDistributions: Array<{
    projectAddress: Hex;
    governancePayment: number;
    percentVotes: number;
    flatPayment: number;
  }>;
}

export function useDistributions(index: number = 0) {
  const API_KEY = process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY;
  const client = new GraphQLClient(SUBGRAPH_QUERY_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  const { data } = useQuery<QueryResponse>({
    placeholderData: keepPreviousData,
    queryKey: ["subgraphs", index],
    async queryFn() {
      return await client.request(`
        query {
          yieldDistributeds(orderBy: timestamp, orderDirection: desc) {
            id
            yield
            totalVotes
            timestamp
            projectDistributions
          }
        }
      `);
    },
  });
  let cycleDistribution: CycleDistribution | null = null;

  const yieldDistribution = data?.yieldDistributeds[index];

  if (yieldDistribution) {
    const totalYield = yieldDistribution.yield;
    const totalVotes = formatUnits(BigInt(yieldDistribution.totalVotes), 18);
    const baseYield = Number(formatUnits(BigInt(totalYield), 18)) / 2;
    const projectDistributions: CycleDistribution["projectDistributions"] = [];

    yieldDistribution.projectDistributions.forEach(
      (projectDistribution, index) => {
        const projectAddress = Object.entries(projectsMeta).find(
          ([_, p]) => p.ydIndex === index
        )?.[0];

        const percent =
          Number(formatUnits(BigInt(projectDistribution), 18)) /
          Number(totalVotes);
        console.log(percent);
        const governancePayment = baseYield * percent;
        projectDistributions.push({
          projectAddress: projectAddress as Hex,
          governancePayment: governancePayment,
          percentVotes: percent,
          flatPayment:
            baseYield / yieldDistribution.projectDistributions.length,
        });
      }
    );

    cycleDistribution = {
      cycleNumber: data?.yieldDistributeds.length - index,
      totalYield: Number(totalYield),
      distributionDate: new Date(Number(yieldDistribution.timestamp) * 1000).toLocaleDateString(),
      projectDistributions
    }
  }

  return {
    cycleDistribution,
    totalDistributions: data?.yieldDistributeds.length,
  };
}
