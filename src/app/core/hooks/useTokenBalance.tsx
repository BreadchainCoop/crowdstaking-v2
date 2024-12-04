import { Hex } from "viem";
import { TConnectedUserState, TUserConnected } from "./useConnectedUser";
import { useContractRead } from "wagmi";
import { ERC20_ABI } from "@/abi";

export function useTokenBalance(user: TConnectedUserState, tokenAddress: Hex) {
  return useContractRead({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [user.status === "CONNECTED" ? user.address : "0x"],
    watch: true,
    enabled: user.status === "CONNECTED",
  });
}
