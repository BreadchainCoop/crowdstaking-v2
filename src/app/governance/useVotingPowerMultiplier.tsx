import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { getChain } from "@/chainConfig";
import { DISTRIBUTOR_ABI } from "@/abi";
import { useReadContract } from "wagmi";

export function useVotingPowerMultiplier(user: TUserConnected) {
  const chainConfig = getChain(user.chain.id);

  const { status, data } = useReadContract({
    address: chainConfig.DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "getTotalMultipliers",
    args: [user.address],
  });

  return {
    data,
    status,
  };
}
