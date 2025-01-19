import { useEffect } from "react";
import { Hex } from "viem";
import { TConnectedUserState } from "./useConnectedUser";
import { useBlockNumber, useReadContract } from "wagmi";
import { ERC20_ABI } from "@/abi";

export function useTokenBalance(user: TConnectedUserState, tokenAddress: Hex) {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data, refetch, isError, isLoading } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [user.status === "CONNECTED" ? user.address : "0x"],
    enabled: user.status === "CONNECTED",
  });

  const refetchTokenBalance = () => {
    if (user.status === "CONNECTED") {
      refetch();
    }
  };

  useEffect(() => {
    refetchTokenBalance();
  }, [blockNumber]);

  return {
    data,
    refetchTokenBalance,
    isError,
    isLoading,
  };
}
