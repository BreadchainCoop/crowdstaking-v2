import { NextRequest, NextResponse } from "next/server";
import { MoneriumOAuthClient, type BearerProfile } from "@monerium/sdk";

import {
  OAUTH_TX_COOKIE,
  TOKENS_COOKIE,
  getMoneriumConfig,
  getRedirectUri,
  tokensCookieOptions,
} from "@/lib/monerium";

/**
 * OAuth callback: verify the state, exchange the authorization code (plus the
 * PKCE verifier) for tokens, store them in an httpOnly cookie, and send the
 * user back to My Account.
 */
export async function GET(req: NextRequest) {
  const config = getMoneriumConfig();
  const profileUrl = new URL("/profile", req.url);
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`?monerium=${reason}`, profileUrl));

  if (!config) return fail("unconfigured");

  const txRaw = req.cookies.get(OAUTH_TX_COOKIE)?.value;
  if (!txRaw) return fail("expired");

  const client = new MoneriumOAuthClient({
    environment: config.environment,
    getAccessToken: async () => undefined,
  });

  const parsed = client.parseAuthorizationResponse(req.url);
  if (parsed.error) return fail("denied");
  if (!parsed.code || !parsed.state) return fail("invalid");

  let tx: { codeVerifier: string; state: string };
  try {
    tx = JSON.parse(txRaw);
  } catch {
    return fail("invalid");
  }
  if (typeof tx.codeVerifier !== "string" || tx.state !== parsed.state) {
    return fail("state_mismatch");
  }

  let tokens: BearerProfile;
  try {
    tokens = await client.authorizationCodeGrant({
      clientId: config.clientId,
      redirectUri: getRedirectUri(req),
      code: parsed.code,
      codeVerifier: tx.codeVerifier,
    });
  } catch (err) {
    console.error("[monerium] token exchange failed", err);
    return fail("exchange_failed");
  }

  const res = NextResponse.redirect(
    new URL("?monerium=connected", profileUrl)
  );
  res.cookies.set(
    TOKENS_COOKIE,
    JSON.stringify({ ...tokens, obtainedAt: Date.now() }),
    tokensCookieOptions()
  );
  // Clear the PKCE cookie (scoped to /api/monerium — delete with the same path).
  res.cookies.set(OAUTH_TX_COOKIE, "", {
    httpOnly: true,
    path: "/api/monerium",
    maxAge: 0,
  });
  return res;
}
