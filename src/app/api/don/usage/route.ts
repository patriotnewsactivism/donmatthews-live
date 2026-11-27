// POST /api/don/usage — report seconds used by a session.
//
// Body: {
//   "browserToken": "<uuid>",
//   "freeSecondsUsed": <number>,   // absolute total for this session, not a delta
//   "paidSecondsUsed": <number>,   // absolute total for this session, not a delta
//   "source": "hero" | "stage"
// }
//
// Values are absolute per-session totals and only ever move up (max wins),
// so the hero's end-of-session beacon and the stage server's authoritative
// report cannot double-count each other.
//
// Auth: the "stage" source must send header
//   x-paywall-secret: <DON_PAYWALL_SHARED_SECRET>
// The "hero" source needs no secret — the random browser token is the
// capability, and it can only ever reduce its own remaining time.
import { NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isBrowserToken,
  paywallConfig,
  type SessionLedger,
} from "@/lib/don-paywall";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { browserToken, freeSecondsUsed, paidSecondsUsed, source } = body;
  if (!isBrowserToken(browserToken)) {
    return NextResponse.json({ error: "Invalid browserToken" }, { status: 400 });
  }
  const freeUsed =
    typeof freeSecondsUsed === "number" && freeSecondsUsed >= 0
      ? Math.floor(freeSecondsUsed)
      : null;
  const paidUsed =
    typeof paidSecondsUsed === "number" && paidSecondsUsed >= 0
      ? Math.floor(paidSecondsUsed)
      : null;
  if (freeUsed === null || paidUsed === null) {
    return NextResponse.json({ error: "Invalid seconds used" }, { status: 400 });
  }

  if (source === "stage") {
    const cfg = paywallConfig();
    const secret = request.headers.get("x-paywall-secret") || "";
    if (!cfg.sharedSecret || secret !== cfg.sharedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (source !== "hero") {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "paywall_not_configured" },
      { status: 503 },
    );
  }
  const { data } = await supabase
    .from("don_paywall_sessions")
    .select("free_seconds_used, paid_seconds_used")
    .eq("browser_token", browserToken)
    .maybeSingle();
  if (!data) {
    return NextResponse.json({ error: "Unknown session" }, { status: 404 });
  }
  const row = data as Pick<SessionLedger, "free_seconds_used" | "paid_seconds_used">;
  const { error } = await supabase
    .from("don_paywall_sessions")
    .update({
      free_seconds_used: Math.max(row.free_seconds_used, freeUsed),
      paid_seconds_used: Math.max(row.paid_seconds_used, paidUsed),
    })
    .eq("browser_token", browserToken);
  if (error) {
    console.error("[don/usage] update failed:", error.message);
    return NextResponse.json({ error: "Could not record usage" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
