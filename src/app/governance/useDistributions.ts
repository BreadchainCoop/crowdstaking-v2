import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { Address, formatUnits, getAddress } from "viem";
import { Hex } from "viem";
import { SUBGRAPH_QUERY_URL } from "@/constants";
import { format } from "date-fns";

interface YieldDistribution {
  id: string;
  yield: string;
  totalVotes: string;
  timestamp: string;
  projectDistributions: Array<string>;
  projectAddresses: Array<Address>;
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
            projectAddresses
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
      (projectDistribution, pIndex) => {
        let projectAddress = yieldDistribution.projectAddresses[pIndex];
        if (!projectAddress) return;

        const percent =
          Number(formatUnits(BigInt(projectDistribution), 18)) /
          Number(totalVotes);
        const governancePayment = baseYield * percent;
        projectDistributions.push({
          projectAddress: getAddress(projectAddress),
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
      distributionDate: format(
        new Date(Number(yieldDistribution.timestamp) * 1000),
        "MM/dd/yyyy"
      ),
      projectDistributions,
    };
  }

  return {
    cycleDistribution,
    totalDistributions: data?.yieldDistributeds.length,
  };
}
