import { useQuery } from "@tanstack/react-query";
import { Address, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const ALCHEMY_MAINNET_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY;
if (!ALCHEMY_MAINNET_API_KEY)
  throw new Error("ALCHEMY_MAINNET_API_KEY not set!");

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAINNET_API_KEY}`
  ),
});

export type TEnsNameLoading = { status: "LOADING" };
export type TEnsNameError = { status: "ERROR" };
export type TEnsNameSuccess = { status: "SUCCESS"; ensName: string | null };

export type TEnsNameState = TEnsNameLoading | TEnsNameError | TEnsNameSuccess;

export function useEnsName(address: string): TEnsNameState {
  const { data, status } = useQuery({
    queryKey: ["ensName", address],
    queryFn: () => publicClient.getEnsName({ address: address as Address }),
  });

  if (status === "error") return { status: "ERROR" };
  if (status === "success") return { status: "SUCCESS", ensName: data };
  return { status: "LOADING" };
}
