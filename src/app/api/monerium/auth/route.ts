import { NextRequest, NextResponse } from "next/server";
import { MoneriumOAuthClient, generatePKCE } from "@monerium/sdk";

import {
  OAUTH_TX_COOKIE,
  getMoneriumConfig,
  getRedirectUri,
} from "@/lib/monerium";

/**
 * Start the Monerium OAuth flow: redirect the user to Monerium's auth page
 * with a PKCE challenge, keeping the verifier + state in a short-lived
 * httpOnly cookie until the callback.
 */
export async function GET(req: NextRequest) {
  const config = getMoneriumConfig();
  if (!config) {
    // Integration not configured — behave as if the feature doesn't exist.
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  const { codeChallenge, codeVerifier } = generatePKCE();
  const state = crypto.randomUUID();

  const client = new MoneriumOAuthClient({
    environment: config.environment,
    getAccessToken: async () => undefined,
  });

  const authUrl = client.buildAuthorizationUrl({
    clientId: config.clientId,
    redirectUri: getRedirectUri(req),
    codeChallenge,
    state,
  });

  const res = NextResponse.redirect(authUrl);
  res.cookies.set(OAUTH_TX_COOKIE, JSON.stringify({ codeVerifier, state }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/monerium",
    maxAge: 600, // 10 minutes to finish the flow
  });
  return res;
}
