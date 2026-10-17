import { NextRequest, NextResponse } from "next/server";
import { MoneriumApiError } from "@monerium/sdk";

import {
  TOKENS_COOKIE,
  getMoneriumClient,
  tokensCookieOptions,
} from "@/lib/monerium";

/**
 * Register the connected wallet as a Monerium "owned" address (on Gnosis) by
 * proving ownership with a signature. Monerium verifies the signature — the
 * fixed message is "I hereby declare that I am the address owner." For
 * smart-contract wallets (e.g. Safe) the client sends an empty `0x` signature
 * and Monerium verifies on-chain via ERC-1271.
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
    signature?: unknown;
  } | null;

  const address = body?.address;
  const signature = body?.signature;

  if (
    typeof address !== "string" ||
    !/^0x[a-fA-F0-9]{40}$/.test(address) ||
    typeof signature !== "string" ||
    signature.length === 0
  ) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const linkResult = await client.linkAddress({
      address,
      signature,
      chain,
    });

    const pending =
      typeof linkResult === "object" &&
      "status" in linkResult &&
      linkResult.status === "Accepted";

    const res = NextResponse.json({ ok: true, pending });
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
    console.error("[monerium] linkAddress failed", err);
    return NextResponse.json(
      { error: err instanceof MoneriumApiError ? err.status : "link_failed" },
      { status: 502 }
    );
  }
}
