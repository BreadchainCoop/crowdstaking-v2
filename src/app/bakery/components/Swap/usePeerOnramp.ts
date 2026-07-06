"use client";

/**
 * State machine for the in-app Peer (ZKP2P) Buyer TEE onramp.
 *
 * Flow: getQuote → signalIntent (on-chain, Base) → ensure extension → authenticate
 * (extension opens the payment-provider tab, user pays, extension captures metadata)
 * → fulfillIntent (posts to Buyer TEE, on-chain fulfillment) → USDC on Base.
 *
 * NEEDS-REAL-TEST: this was written against the SDK's published types + Peer's agent
 * guide but could not be runtime-tested in the sandbox. The two spots most likely to
 * need adjustment after a real wallet+extension run are (1) extracting `intentHash`
 * from the signalIntent receipt and (2) the exact payment-row matching. Both are
 * isolated and commented below.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { useAccount, usePublicClient, useSwitchChain, useWalletClient } from "wagmi";
import { parseEventLogs, type Abi } from "viem";
import type {
  BuyerTeePaymentProofInput,
  GetQuoteSingleResponse,
  PeerBuyerTeePaymentCapture,
  PeerMetadataMessage,
  PeerMetadataRow,
} from "@zkp2p/sdk";
import {
  ATTESTATION_SERVICE_URL,
  PEER_CHAIN_ID,
  PEER_DESTINATION_TOKEN,
  createPeerClient,
  ensurePeerReady,
  getPeerExtension,
  type PeerFiat,
  type PeerPlatform,
} from "@/lib/peerSdk";

export type PeerOnrampStatus =
  | "idle"
  | "quoting"
  | "quote_ready"
  | "need_extension"
  | "signalling"
  | "awaiting_payment"
  | "verifying"
  | "success"
  | "error";

export type PeerOnrampParams = {
  platform: PeerPlatform;
  fiat: PeerFiat;
  amount: string;
};

function isBuyerTeeParams(value: unknown): value is Record<string, string | number | boolean> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (v) => typeof v === "string" || typeof v === "number" || typeof v === "boolean",
    )
  );
}

/** Pick the payment row the buyer actually made. Use row.originalIndex, not a UI index. */
function selectPaymentRow(
  rows: PeerMetadataRow[],
  expected: { amount?: string; currency?: string },
): PeerMetadataRow | null {
  const visible = rows.filter((r) => !r.hidden && isBuyerTeeParams(r.params));
  return (
    visible.find(
      (r) =>
        (!expected.amount || r.amount === expected.amount) &&
        (!expected.currency || r.currency === expected.currency),
    ) ??
    visible[0] ??
    null
  );
}

function buildProof(
  row: PeerMetadataRow,
  capture: PeerBuyerTeePaymentCapture | null | undefined,
  platform: PeerPlatform,
): BuyerTeePaymentProofInput {
  if (!capture?.encryptedSessionMaterial || !isBuyerTeeParams(row.params)) {
    throw new Error("Payment row is missing Buyer TEE capture data");
  }
  if (platform.includeMetadataIndex && !Number.isInteger(row.originalIndex)) {
    throw new Error("Payment row is missing its provider metadata index");
  }
  return {
    proofType: "buyerTee",
    encryptedSessionMaterial: capture.encryptedSessionMaterial,
    params: {
      ...row.params,
      ...(platform.includeMetadataIndex ? { index: row.originalIndex } : {}),
    },
    actionPlatform: platform.actionPlatform,
    actionType: platform.actionType,
  };
}

export function usePeerOnramp() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: PEER_CHAIN_ID });
  const publicClient = usePublicClient({ chainId: PEER_CHAIN_ID });
  const { switchChainAsync } = useSwitchChain();

  const [status, setStatus] = useState<PeerOnrampStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<GetQuoteSingleResponse | null>(null);

  // Keep the active metadata subscription so we can tear it down.
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const reset = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setStatus("idle");
    setError(null);
    setQuote(null);
  }, []);

  const fail = useCallback((message: string) => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setError(message);
    setStatus("error");
  }, []);

  /** Step 1 — fetch a quote for the chosen platform/currency/amount. */
  const fetchQuote = useCallback(
    async ({ platform, fiat, amount }: PeerOnrampParams) => {
      if (!walletClient || !address) {
        fail("Connect a wallet first");
        return null;
      }
      setError(null);
      setStatus("quoting");
      try {
        const client = createPeerClient(walletClient);
        const res = await client.getQuote({
          paymentPlatforms: [platform.actionPlatform],
          fiatCurrency: fiat,
          user: address,
          recipient: address,
          destinationChainId: PEER_CHAIN_ID,
          destinationToken: PEER_DESTINATION_TOKEN,
          amount,
          isExactFiat: true,
        });
        const best = res.responseObject?.quotes?.[0] ?? null;
        if (!best) {
          fail("No offers available for that amount and payment method");
          return null;
        }
        setQuote(best);
        setStatus("quote_ready");
        return best;
      } catch (e) {
        fail(e instanceof Error ? e.message : "Failed to get a quote");
        return null;
      }
    },
    [walletClient, address, fail],
  );

  /** Steps 2-5 — signal the intent, capture payment via the extension, fulfill. */
  const purchase = useCallback(
    async ({ platform, fiat }: Omit<PeerOnrampParams, "amount">) => {
      if (!walletClient || !address || !publicClient || !quote) {
        fail("Missing wallet, network, or quote");
        return;
      }

      try {
        // Ensure the wallet is on Base for the on-chain steps.
        if (walletClient.chain?.id !== PEER_CHAIN_ID) {
          await switchChainAsync({ chainId: PEER_CHAIN_ID });
        }

        const client = createPeerClient(walletClient);

        // --- Step 2: signal intent (on-chain) ---
        setStatus("signalling");
        const intent = quote.intent;
        const txHash = await client.signalIntent({
          depositId: String(intent.depositId),
          amount: quote.signalIntentAmount ?? quote.tokenAmount,
          toAddress: intent.toAddress as `0x${string}`,
          processorName: intent.processorName,
          payeeDetails: intent.payeeDetails,
          fiatCurrencyCode: intent.fiatCurrencyCode,
          conversionRate: quote.conversionRate,
        });

        // NEEDS-REAL-TEST: derive intentHash from the IntentSignaled event. The event
        // name / arg name should be confirmed against a real receipt; we scan the
        // orchestrator ABI (then escrow ABI) for an `intentHash` arg.
        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
        const intentHash = extractIntentHash(receipt.logs, [
          client.orchestratorAbi as Abi | undefined,
          client.escrowAbi as Abi | undefined,
        ]);
        if (!intentHash) {
          fail("Could not read the intent from the transaction — please try again");
          return;
        }

        // --- Step 3: ensure the extension is ready ---
        const readiness = await ensurePeerReady();
        if (!readiness.ok) {
          setStatus("need_extension");
          return;
        }

        // --- Step 4: register capture handler, then authenticate ---
        const peer = getPeerExtension();
        setStatus("awaiting_payment");

        unsubscribeRef.current = peer.onMetadataMessage(async (message: PeerMetadataMessage) => {
          try {
            if (message.errorMessage) throw new Error(message.errorMessage);
            const row = selectPaymentRow(message.metadata, {
              currency: fiat,
              amount: quote.fiatAmount,
            });
            if (!row) throw new Error("No matching payment was found");

            setStatus("verifying");
            const proof = buildProof(row, message.buyerTeeCapture, platform);

            // --- Step 5: fulfill (Buyer TEE attestation + on-chain) ---
            await client.fulfillIntent({
              intentHash,
              proof,
              attestationServiceUrl: ATTESTATION_SERVICE_URL,
            });
            setStatus("success");
          } catch (e) {
            fail(e instanceof Error ? e.message : "Payment verification failed");
          } finally {
            unsubscribeRef.current?.();
            unsubscribeRef.current = null;
          }
        });

        peer.authenticate({
          actionType: platform.actionType,
          attestationActionType: platform.actionType,
          attestationServiceUrl: ATTESTATION_SERVICE_URL,
          captureMode: "buyerTee",
          platform: platform.actionPlatform,
        });
      } catch (e) {
        fail(e instanceof Error ? e.message : "Purchase failed");
      }
    },
    [walletClient, address, publicClient, quote, switchChainAsync, fail],
  );

  const isConnected = useMemo(() => Boolean(address && walletClient), [address, walletClient]);

  return { status, error, quote, isConnected, fetchQuote, purchase, reset };
}

/** Scan receipt logs for an IntentSignaled-style event carrying an intentHash arg. */
function extractIntentHash(
  logs: readonly unknown[],
  abis: (Abi | undefined)[],
): `0x${string}` | null {
  for (const abi of abis) {
    if (!abi) continue;
    try {
      const parsed = parseEventLogs({
        abi,
        logs: logs as never,
        eventName: "IntentSignaled",
      });
      for (const ev of parsed) {
        const args = (ev as { args?: Record<string, unknown> }).args;
        const hash = args?.intentHash;
        if (typeof hash === "string" && hash.startsWith("0x")) {
          return hash as `0x${string}`;
        }
      }
    } catch {
      // event not in this ABI — try the next
    }
  }
  return null;
}
