import {
  MoneriumApiError,
  MoneriumOAuthClient,
  type BearerProfile,
  type Chain,
  type ENV,
} from "@monerium/sdk";
import type { NextRequest } from "next/server";

/**
 * Monerium integration — server-side helpers.
 *
 * The Solidarity Fund uses Monerium's OAuth (authorization code + PKCE) flow
 * so members can connect their Monerium euro account, see their IBAN, and
 * register the wallet they use on this app as a Monerium "owned" address.
 * Euros sent to that IBAN are minted 1:1 as EURe on Gnosis, which the member
 * can then swap for xDAI and bake into BREAD.
 *
 * All Monerium API calls happen in Next.js route handlers: the Monerium API
 * does not send CORS headers to browsers, and the user's tokens must stay in
 * httpOnly cookies. The client only ever talks to `/api/monerium/*`.
 *
 * Setup: register an OAuth application in the Monerium developer portal
 * (https://sandbox.monerium.dev → Developers → Create application → OAuth),
 * use `{origin}/api/monerium/callback` as the redirect URI, and set
 * `NEXT_PUBLIC_MONERIUM_CLIENT_ID` (plus `NEXT_PUBLIC_MONERIUM_ENV`).
 */

/** Cookie holding the OAuth access/refresh token pair (httpOnly). */
export const TOKENS_COOKIE = "monerium_tokens";

/** Short-lived cookie holding the PKCE verifier + state during the OAuth round-trip. */
export const OAUTH_TX_COOKIE = "monerium_oauth_tx";

export interface MoneriumConfig {
  clientId: string;
  environment: ENV;
  /**
   * Monerium chain name for this environment: `gnosis` in production,
   * `chiado` in sandbox (Monerium mints sandbox EURe on the Chiado testnet).
   */
  chain: Chain;
}

/**
 * Read the Monerium configuration from env vars. Returns null when the
 * integration is not configured — every route and the UI treat that as
 * "feature disabled".
 */
export function getMoneriumConfig(): MoneriumConfig | null {
  const clientId = process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID;
  if (!clientId) return null;
  const environment: ENV =
    process.env.NEXT_PUBLIC_MONERIUM_ENV === "production"
      ? "production"
      : "sandbox";
  const chain: Chain = environment === "production" ? "gnosis" : "chiado";
  return { clientId, environment, chain };
}

/** The OAuth redirect URI. Defaults to `{origin}/api/monerium/callback`. */
export function getRedirectUri(req: NextRequest): string {
  return (
    process.env.MONERIUM_REDIRECT_URI ??
    new URL("/api/monerium/callback", req.url).toString()
  );
}

/** A BearerProfile as persisted in the tokens cookie. */
export interface StoredTokens extends BearerProfile {
  /** ms since epoch at which the access token was obtained. */
  obtainedAt: number;
}

function isExpired(tokens: StoredTokens): boolean {
  return Date.now() >= tokens.obtainedAt + tokens.expires_in * 1000 - 30_000;
}

export function tokensCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

type GetClientResult =
  | {
      ok: true;
      client: MoneriumOAuthClient;
      /** Monerium chain for the configured environment (see getMoneriumConfig). */
      chain: Chain;
      /** Present when the token pair was refreshed (refresh tokens rotate — persist the newest). */
      rotatedTokens?: StoredTokens;
    }
  | { ok: false; error: "unconfigured" | "not_connected" | "refresh_failed" };

/**
 * Build an authenticated Monerium client for a request, refreshing the access
 * token (and rotating the refresh token) if it has expired.
 */
export async function getMoneriumClient(
  req: NextRequest
): Promise<GetClientResult> {
  const config = getMoneriumConfig();
  if (!config) return { ok: false, error: "unconfigured" };

  const raw = req.cookies.get(TOKENS_COOKIE)?.value;
  if (!raw) return { ok: false, error: "not_connected" };

  let tokens: StoredTokens;
  try {
    tokens = JSON.parse(raw) as StoredTokens;
  } catch {
    return { ok: false, error: "not_connected" };
  }

  let rotatedTokens: StoredTokens | undefined;

  if (isExpired(tokens)) {
    try {
      const refresher = new MoneriumOAuthClient({
        environment: config.environment,
        getAccessToken: async () => tokens.access_token,
      });
      const refreshed = await refresher.refreshTokenGrant({
        clientId: config.clientId,
        refreshToken: tokens.refresh_token,
      });
      tokens = { ...refreshed, obtainedAt: Date.now() };
      rotatedTokens = tokens;
    } catch (err) {
      if (err instanceof MoneriumApiError && err.code === 400) {
        // invalid_grant — the user revoked the app or the token expired for good.
        return { ok: false, error: "refresh_failed" };
      }
      throw err;
    }
  }

  const client = new MoneriumOAuthClient({
    environment: config.environment,
    getAccessToken: async () => tokens.access_token,
  });

  return { ok: true, client, chain: config.chain, rotatedTokens };
}
