import { TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { getChain } from "@/chainConfig";
import { DISTRIBUTOR_ABI } from "@/abi";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";

export function useCurrentAccumulatedVotingPower(user: TUserConnected) {
  const chainConfig = getChain(user.chain.id);

  const { data, status } = useRefetchOnBlockChangeForUser(
    user.address,
    chainConfig.DISBURSER.address,
    DISTRIBUTOR_ABI,
    "getCurrentAccumulatedVotingPower",
    [user.address]
  );

  return {
    data,
    status,
  };
}
