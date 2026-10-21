import { NextRequest, NextResponse } from "next/server";
import { MoneriumApiError } from "@monerium/sdk";

import {
  TOKENS_COOKIE,
  getMoneriumClient,
  tokensCookieOptions,
} from "@/lib/monerium";

/**
 * The connected user's Monerium context: auth context (who they are),
 * profiles (KYC state), IBANs, and linked ("owned") wallet addresses.
 * All fetched server-side with the user's httpOnly tokens.
 */
export async function GET(req: NextRequest) {
  const result = await getMoneriumClient(req);
  if (!result.ok) {
    const res = NextResponse.json({ connected: false }, { status: 401 });
    if (result.error === "refresh_failed" || result.error === "not_connected") {
      res.cookies.delete(TOKENS_COOKIE);
    }
    return res;
  }

  const { client, rotatedTokens } = result;

  let payload;
  try {
    const [authContext, profiles, ibans, addresses] = await Promise.all([
      client.getAuthContext(),
      client.getProfiles(),
      client.getIbans(),
      client.getAddresses(),
    ]);

    payload = {
      authContext,
      profiles: profiles.profiles,
      ibans: ibans.ibans,
      addresses: addresses.addresses,
    };
  } catch (err) {
    if (err instanceof MoneriumApiError && err.code === 401) {
      const res = NextResponse.json({ connected: false }, { status: 401 });
      res.cookies.delete(TOKENS_COOKIE);
      return res;
    }
    console.error("[monerium] context fetch failed", err);
    return NextResponse.json(
      { error: "monerium_context_failed" },
      { status: 502 }
    );
  }

  const res = NextResponse.json(payload);
  if (rotatedTokens) {
    res.cookies.set(
      TOKENS_COOKIE,
      JSON.stringify(rotatedTokens),
      tokensCookieOptions()
    );
  }
  return res;
}
