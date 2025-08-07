import { TUnsupportedChain, TUserConnected } from "@/app/core/hooks/useConnectedUser";
import { getChain } from "@/chainConfig";
import { DISTRIBUTOR_ABI } from "@/abi";
import { useRefetchOnBlockChangeForUser } from "@/app/core/hooks/useRefetchOnBlockChange";
import { useActiveChain } from "../core/hooks/useActiveChain";

export function useCurrentAccumulatedVotingPower(user: TUserConnected | TUnsupportedChain) {
  const chainConfig = useActiveChain()

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
