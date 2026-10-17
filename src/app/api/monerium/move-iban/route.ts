import { NextRequest, NextResponse } from "next/server";
import { MoneriumApiError } from "@monerium/sdk";

import {
  TOKENS_COOKIE,
  getMoneriumClient,
  tokensCookieOptions,
} from "@/lib/monerium";

/**
 * Point the user's approved Monerium IBAN at the connected wallet on Gnosis,
 * so incoming SEPA payments are minted as EURe directly to the wallet they
 * use on this app.
 */
export async function POST(req: NextRequest) {
  const result = await getMoneriumClient(req);
  if (!result.ok) {
    const res = NextResponse.json({ error: "not_connected" }, { status: 401 });
    if (result.error === "refresh_failed") res.cookies.delete(TOKENS_COOKIE);
    return res;
  }
  const { client, chain, rotatedTokens } = result;

  const body = (await req.json().catch(() => null)) as {
    address?: unknown;
  } | null;

  const address = body?.address;
  if (typeof address !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const { ibans } = await client.getIbans();
    const activeIban = ibans.find((iban) => iban.state === "approved");

    if (!activeIban) {
      return NextResponse.json(
        { error: "no_active_iban" },
        { status: 400 }
      );
    }

    await client.moveIban({
      iban: activeIban.iban,
      address,
      chain,
    });

    const res = NextResponse.json({ ok: true });
    if (rotatedTokens) {
      res.cookies.set(
        TOKENS_COOKIE,
        JSON.stringify(rotatedTokens),
        tokensCookieOptions()
      );
    }
    return res;
  } catch (err) {
    if (err instanceof MoneriumApiError && err.code === 401) {
      const res = NextResponse.json({ error: "not_connected" }, { status: 401 });
      res.cookies.delete(TOKENS_COOKIE);
      return res;
    }
    console.error("[monerium] moveIban failed", err);
    return NextResponse.json(
      { error: err instanceof MoneriumApiError ? err.status : "move_iban_failed" },
      { status: 502 }
    );
  }
}
