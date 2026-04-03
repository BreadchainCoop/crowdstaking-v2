import { useEffect } from "react";
import { useBalance, useBlockNumber, useReadContract } from "wagmi";
import { Hex } from "viem";
import { useActiveChain } from "./useActiveChain";
import { publicConfig } from "./WagmiProvider/config/publicConfig";

export function useRefetchOnBlockChangeForUser(
  userAddress: Hex,
  contractAddress: Hex,
  abi: any,
  functionName: string,
  args: any[]
) {
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: useActiveChain().ID,
    config: publicConfig,
  });
  const { status, data, error, refetch } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: functionName,
    args: args,
    chainId: useActiveChain().ID,
    config: publicConfig,
  });

  useEffect(() => {
    if (userAddress) {
      refetch();
    }
  }, [blockNumber, userAddress, refetch]);

  return { status, error, data };
}

export function useRefetchOnBlockChange(
  contractAddress: Hex,
  abi: any,
  functionName: string,
  args: any[],
  query?: { enabled: boolean }
) {
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: useActiveChain().ID,
    config: publicConfig,
  });
  const { status, data, error, refetch } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: functionName,
    args: args,
    query: query,
    chainId: useActiveChain().ID,
    config: publicConfig,
  });

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  return { status, error, data };
}

export function useRefetchBalanceOnBlockChange(userAddress: Hex) {
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: useActiveChain().ID,
    config: publicConfig,
  });
  const { data, status, error, refetch } = useBalance({
    address: userAddress,
    chainId: useActiveChain().ID,
    config: publicConfig,
  });

  useEffect(() => {
    if (userAddress) {
      refetch();
    }
  }, [blockNumber, userAddress, refetch]);

  return { status, data, error };
}
