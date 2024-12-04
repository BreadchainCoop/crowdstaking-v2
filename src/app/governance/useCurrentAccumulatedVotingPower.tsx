import { useContractRead } from "wagmi";
import { TUserConnected } from "../core/hooks/useConnectedUser";
import { getConfig } from "@/chainConfig";
import { DISTRIBUTOR_ABI } from "@/abi";

export function useCurrentAccumulatedVotingPower(user: TUserConnected) {
  const config = getConfig(user.chain.id);

  return useContractRead({
    address: config.DISBURSER.address,
    abi: DISTRIBUTOR_ABI,
    functionName: "getCurrentAccumulatedVotingPower",
    args: [user.address],
    watch: true,
    cacheTime: 5_000,
  });
}
