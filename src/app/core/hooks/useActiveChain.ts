import { getChain } from "@/chainConfig";

export function useActiveChain() {
  return getChain("DEFAULT");
}
