"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Address, formatUnits } from "viem";
import { BREAD_ADDRESS } from "@/constants";
import { useUserVoteCount } from "@/app/governance/useUserVoteCount";

// Bake mints BREAD (Transfer from the zero address) and un-baking burns it
// (Transfer to the zero address). The Gnosis explorer's token-transfer index
// already tags those as `token_minting` / `token_burning`, so a single REST
// call gives us the account's full deposit/withdraw history without scanning
// ~15M blocks of logs on a public RPC. Votes come from the governance subgraph.
const BLOCKSCOUT_API = "https://gnosis.blockscout.com/api/v2";

export type AccountHistoryType = "deposit" | "withdraw" | "vote";

export interface AccountHistoryEntry {
  type: AccountHistoryType;
  /** BREAD amount for deposits/withdrawals; undefined for votes. */
  amount?: number;
  /** How many projects a vote spread its points across. */
  projectCount?: number;
  txHash: string;
  /** Block time in milliseconds since epoch. */
  timestamp: number;
}

interface BlockscoutTransfer {
  type: string;
  total?: { value?: string; decimals?: string };
  transaction_hash: string;
  timestamp: string;
}

async function fetchBreadMintBurn(
  address: Address
): Promise<AccountHistoryEntry[]> {
  const url = `${BLOCKSCOUT_API}/addresses/${address}/token-transfers?token=${BREAD_ADDRESS}`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const json = (await res.json()) as { items?: BlockscoutTransfer[] };

  return (json.items ?? [])
    .filter(
      (item) => item.type === "token_minting" || item.type === "token_burning"
    )
    .map((item) => ({
      type: (item.type === "token_minting"
        ? "deposit"
        : "withdraw") as AccountHistoryType,
      amount: Number(
        formatUnits(
          BigInt(item.total?.value ?? "0"),
          Number(item.total?.decimals ?? 18)
        )
      ),
      txHash: item.transaction_hash,
      timestamp: new Date(item.timestamp).getTime(),
    }));
}

/**
 * The connected account's on-chain activity — BREAD deposits (bakes) and
 * withdrawals (burns) plus governance votes — merged newest-first.
 */
export function useAccountHistory(address: Address | undefined) {
  const { data: votesData, isLoading: votesLoading } =
    useUserVoteCount(address);

  const { data: transfers = [], isLoading: transfersLoading } = useQuery({
    queryKey: ["accountHistory", "bread-transfers", address?.toLowerCase()],
    enabled: Boolean(address),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    queryFn: () => fetchBreadMintBurn(address as Address),
  });

  const voteEntries: AccountHistoryEntry[] = votesData.votes.map((vote) => ({
    type: "vote",
    projectCount: vote.projects.length,
    txHash: vote.transactionHash,
    timestamp: vote.timestamp,
  }));

  const history = [...transfers, ...voteEntries].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return { history, isLoading: votesLoading || transfersLoading };
}
