// GET /api/don/balance?session=<browserToken>
// POST /api/don/balance { "browserToken": "<uuid>" }
//
// Returns the remaining free + paid seconds for a browser-token session.
// The hosted stage server uses the GET form to learn the budget it must
// enforce for a live connection (see docs/don-paywall-stage-patch.md).
// No auth: the random browser token itself is the capability, and the
// response reveals only a seconds count — never an IP or a payment detail.
import { NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isBrowserToken,
  remainingSeconds,
  type SessionLedger,
} from "@/lib/don-paywall";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readToken(request: Request): string | null {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("session");
  if (fromQuery) return fromQuery;
  return null;
}

async function handle(token: unknown) {
  if (!isBrowserToken(token)) {
    return NextResponse.json({ error: "Invalid browserToken" }, { status: 400 });
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
    .select(
      "browser_token, ip_hash, free_seconds_granted, free_seconds_used, paid_seconds_granted, paid_seconds_used",
    )
    .eq("browser_token", token)
    .maybeSingle();
  if (!data) {
    return NextResponse.json(
      { error: "Unknown session", secondsRemaining: 0 },
      { status: 404 },
    );
  }
  const remaining = remainingSeconds(data as SessionLedger);
  return NextResponse.json({
    sessionId: token,
    secondsRemaining: remaining.total,
    freeSecondsRemaining: remaining.free,
    paidSecondsRemaining: remaining.paid,
  });
}

export async function GET(request: Request) {
  return handle(readToken(request));
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // fall through to the 400 below
  }
  const token =
    body && typeof body === "object" && "browserToken" in body
      ? (body as { browserToken: unknown }).browserToken
      : null;
  return handle(token);
}
