import { useEffect } from "react";
import { useBlockNumber, useReadContract } from "wagmi";
import { TUserConnected } from "../core/hooks/useConnectedUser";
import { getConfig } from "@/chainConfig";
import { DISTRIBUTOR_ABI } from "@/abi";

export function useCurrentAccumulatedVotingPower(user: TUserConnected) {
  const config = getConfig(user.chain.id);
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data, refetch, isError, isLoading } = useReadContract({
    address: config.DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "getCurrentAccumulatedVotingPower",
    args: [user.address],
  });

  const refetchVotingPower = () => {
    if (user.status === "CONNECTED") {
      refetch();
    }
  };

  useEffect(() => {
    refetchVotingPower();
  }, [blockNumber]);

  return {
    data,
    refetchVotingPower,
    isError,
    isLoading,
  };
}
