import { getPublicClient } from "@wagmi/core";
import { getConfig } from "@/app/core/hooks/WagmiProvider/config/getConfig";
import { useActiveChain } from "@/app/core/hooks/useActiveChain";
import { useQuery } from "@tanstack/react-query";
import { formatUnits, parseAbiItem } from "viem";

export function useDistributions() {
  const chainConfig = useActiveChain();
  const publicClient = getPublicClient(getConfig().config);

  return useQuery({
    queryKey: ["getDistributions"],
    refetchInterval: 1000,
    queryFn: async () => {
      // const logs = await publicClient.getContractEvents({
      //   address: distributorAddress,
      //   abi: DISTRIBUTOR_ABI,
      //   // eventName: "YieldDistributed",
      //   fromBlock: BigInt(34695057),
      //   toBlock: "latest",
      // });

      const logs = await publicClient.getLogs({
        address: chainConfig.DISBURSER.address,
        event: parseAbiItem(
          "event YieldDistributed(uint256, uint256, uint256[])"
        ),
        // args: {
        //   from: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        //   to: "0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac",
        // },
        fromBlock: BigInt(34695057),
        toBlock: "latest",
      });

      return logs.map((log) => {
        const [totalYield, totalVotes, distributions] = log.args;
        if (!totalYield || !totalVotes || !distributions) {
          throw new Error("error in distribution events response");
        }

        const votesTotal = formatUnits(totalVotes, 18);

        const baseYield = Number(formatUnits(totalYield, 18)) / 2;

        // console.log("yield: ", formatUnits(totalYield, 18));
        // console.log("total votes: ", formatUnits(totalVotes, 18));
        distributions.forEach((d) => {
          const percent =
            (Number(formatUnits(d, 18)) / Number(votesTotal)) * 100;

          const payment = baseYield * percent;
          // console.log("payment: ", payment);
          // console.log("percent: ", percent);
        });
      });
    },
  });
}
