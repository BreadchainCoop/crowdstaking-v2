import { NextRequest, NextResponse } from "next/server";

import { TOKENS_COOKIE } from "@/lib/monerium";

/** Disconnect: drop the stored Monerium tokens. */
export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(TOKENS_COOKIE);
  return res;
}
