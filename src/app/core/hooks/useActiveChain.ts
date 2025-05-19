import { useAccount } from "wagmi";
import { getChain } from "@/chainConfig";

export function useActiveChain() {
  const { chain: activeChain } = useAccount();
  const chainConfig = activeChain
    ? getChain(activeChain.id)
    : getChain("DEFAULT");

  return chainConfig;
}
