"use client";

/**
 * Thin wrapper around @zkp2p/sdk for the in-app Peer onramp (Buyer TEE flow).
 *
 * Peer deprecated the old redirect/deeplink onramp; the supported path is this
 * headless SDK flow where our app owns the UI and the PeerAuth browser extension
 * (>= 0.6.3) acts as a payment-capture bridge. No API key is required for the
 * buyer flow — `apiKey`/`authorizationToken` on Zkp2pClient are for seller/curator
 * operations only.
 *
 * IMPORTANT: this module talks to a live protocol on Base mainnet and could not be
 * runtime-tested in the dev sandbox. The lifecycle matches Peer's agent guide and
 * the SDK's published types, but the on-chain + extension path must be verified
 * with a real wallet + the extension on the deploy preview. Spots that most need
 * that confirmation are marked NEEDS-REAL-TEST.
 */

import {
  Zkp2pClient,
  createPeerExtensionSdk,
  SUPPORTED_CHAIN_IDS,
  Currency,
  type CurrencyType,
  type PeerExtensionSdk,
  type PeerExtensionState,
} from "@zkp2p/sdk";
import type { WalletClient } from "viem";

/** Base mainnet — the only chain Peer delivers onramp funds to. */
export const PEER_CHAIN_ID: number = SUPPORTED_CHAIN_IDS.BASE_MAINNET; // 8453

/** Native USDC on Base — the token buyers receive. */
export const PEER_DESTINATION_TOKEN = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

/** Peer's Buyer TEE attestation service. */
export const ATTESTATION_SERVICE_URL = "https://attestation-service.zkp2p.xyz";

/** Minimum extension version that supports the headless Buyer TEE capture. */
export const MIN_PEER_EXTENSION_VERSION = "0.6.3";

export type PeerFiat = "USD" | "EUR" | "GBP";

export const PEER_FIATS: { code: PeerFiat; currency: CurrencyType }[] = [
  { code: "USD", currency: Currency.USD },
  { code: "EUR", currency: Currency.EUR },
  { code: "GBP", currency: Currency.GBP },
];

/**
 * Per-platform Buyer TEE routing config.
 *
 * `includeMetadataIndex` rule is from Peer's agent guide: include the provider
 * metadata index only for Venmo, Cash App, Revolut, Zelle. `actionType` values
 * follow the documented `transfer_<platform>` convention (Venmo confirmed in the
 * guide as `transfer_venmo`). NEEDS-REAL-TEST for the non-Venmo action types.
 */
export type PeerPlatform = {
  key: string;
  label: string;
  actionPlatform: string;
  actionType: string;
  includeMetadataIndex: boolean;
};

export const PEER_PLATFORMS: PeerPlatform[] = [
  { key: "wise", label: "Wise", actionPlatform: "wise", actionType: "transfer_wise", includeMetadataIndex: false },
  { key: "revolut", label: "Revolut", actionPlatform: "revolut", actionType: "transfer_revolut", includeMetadataIndex: true },
  { key: "venmo", label: "Venmo", actionPlatform: "venmo", actionType: "transfer_venmo", includeMetadataIndex: true },
];

export function getPeerPlatform(key: string): PeerPlatform | undefined {
  return PEER_PLATFORMS.find((p) => p.key === key);
}

export function getPeerFiat(code: PeerFiat): CurrencyType {
  return PEER_FIATS.find((f) => f.code === code)?.currency ?? Currency.USD;
}

/** Construct an app-owned Zkp2pClient from a viem WalletClient (must be on Base). */
export function createPeerClient(walletClient: WalletClient): Zkp2pClient {
  return new Zkp2pClient({
    walletClient,
    chainId: PEER_CHAIN_ID,
  });
}

/** Lazily-created singleton extension bridge (browser only). */
let _peerExtension: PeerExtensionSdk | null = null;

export function getPeerExtension(): PeerExtensionSdk {
  if (typeof window === "undefined") {
    throw new Error("Peer extension is only available in the browser");
  }
  if (!_peerExtension) {
    _peerExtension = createPeerExtensionSdk({ window });
  }
  return _peerExtension;
}

export function isPeerExtension063OrNewer(version: string): boolean {
  const [major = 0, minor = 0, patch = 0] = version.split(".").map(Number);
  if (major !== 0) return major > 0;
  if (minor !== 6) return minor > 6;
  return patch >= 3;
}

export type PeerReadiness =
  | { ok: true }
  | { ok: false; reason: "needs_install" | "needs_connection" | "outdated"; version?: string };

/**
 * Ensure the extension is installed, connected, and new enough. Opens the install
 * page or requests connection as needed. Returns a structured readiness result so
 * the UI can render the right prompt rather than throwing.
 */
export async function ensurePeerReady(): Promise<PeerReadiness> {
  const peer = getPeerExtension();
  const state: PeerExtensionState = await peer.getState();

  if (state === "needs_install") {
    peer.openInstallPage();
    return { ok: false, reason: "needs_install" };
  }

  if (state === "needs_connection") {
    const approved = await peer.requestConnection();
    if (!approved) return { ok: false, reason: "needs_connection" };
  }

  const version = await peer.getVersion();
  if (!isPeerExtension063OrNewer(version)) {
    return { ok: false, reason: "outdated", version };
  }

  return { ok: true };
}
