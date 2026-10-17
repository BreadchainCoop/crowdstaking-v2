"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSignMessage } from "wagmi";
import type { Address } from "viem";
import type {
  AuthContext,
  Chain,
  IBAN,
  Profile,
  Address as MoneriumAddress,
} from "@monerium/sdk";

/**
 * Monerium state for the My Account page.
 *
 * All Monerium API access is proxied through `/api/monerium/*` route
 * handlers — the browser never sees the user's Monerium tokens.
 */

/**
 * Monerium chain for the configured environment — `gnosis` in production,
 * `chiado` in sandbox (Monerium mints sandbox EURe on the Chiado testnet).
 * Must stay in sync with `getMoneriumConfig()` in `src/lib/monerium.ts`.
 */
export const MONERIUM_CHAIN: Chain =
  process.env.NEXT_PUBLIC_MONERIUM_ENV === "production"
    ? "gnosis"
    : "chiado";

/** Fixed ownership message required by Monerium's link-address endpoint. */
export const LINK_MESSAGE = "I hereby declare that I am the address owner.";

export interface MoneriumContext {
  authContext: AuthContext;
  profiles: Omit<Profile, "details" | "form" | "verifications">[];
  ibans: IBAN[];
  addresses: MoneriumAddress[];
}

const MONERIUM_QUERY_KEY = ["monerium", "context"] as const;

async function postJson(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function useMonerium(
  address: Address | undefined,
  isSafe: boolean
) {
  const queryClient = useQueryClient();
  const { signMessageAsync } = useSignMessage();

  const context = useQuery<MoneriumContext | null>({
    queryKey: MONERIUM_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/monerium/context");
      if (res.status === 401) return null; // not connected (or session expired)
      if (!res.ok) throw new Error("Failed to load Monerium account");
      return (await res.json()) as MoneriumContext;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: MONERIUM_QUERY_KEY });

  /** Full-page redirect — the OAuth flow has to leave the app. */
  const connect = () => {
    window.location.assign("/api/monerium/auth");
  };

  const disconnect = useMutation({
    mutationFn: () => postJson("/api/monerium/disconnect"),
    onSuccess: invalidate,
  });

  const linkWallet = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Connect your wallet first");
      // EOAs sign the fixed ownership message. Smart-contract wallets (Safe)
      // are verified by Monerium on-chain via ERC-1271 — for those the API
      // expects an empty `0x` signature instead.
      const signature = isSafe
        ? "0x"
        : await signMessageAsync({ message: LINK_MESSAGE });
      return postJson("/api/monerium/link-address", { address, signature });
    },
    onSuccess: invalidate,
  });

  const moveIban = useMutation({
    mutationFn: () => {
      if (!address) throw new Error("Connect your wallet first");
      return postJson("/api/monerium/move-iban", { address });
    },
    onSuccess: invalidate,
  });

  return { context, connect, disconnect, linkWallet, moveIban };
}
