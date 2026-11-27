// POST /api/don/session — start (or resume) a Don conversation.
//
// Body: { "browserToken": "<uuid the hero keeps in localStorage>" }
//
// Paywall gate (server-side, enforced here — never client-side only):
// - The caller's IP is hashed (SHA-256, raw IP never stored). The first mint
//   from an IP hash claims that IP's one free minute (60s) forever.
// - A repeat mint from the same IP hash gets 0 free seconds. Refreshing,
//   incognito, or a new browser token does NOT reset it — the IP registry
//   is the source of truth, not the browser.
// - Paid seconds live on the browser-token session row (credited by the
//   Stripe webhook). A returning visitor resumes with the same token.
//
// On success returns the Anam session token minted by the hosted stage
// server (DON_STAGE_URL), plus the seconds budget for this session.
// The stage server enforces the budget live (see docs/don-paywall-stage-patch.md);
// the hero also counts down and stops at 0 as defense in depth.
import { NextResponse } from "next/server";
import {
  FREE_SECONDS,
  getClientIp,
  getSupabaseAdmin,
  hashIp,
  isBrowserToken,
  paywallConfig,
  remainingSeconds,
  type SessionLedger,
} from "@/lib/don-paywall";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const browserToken =
    body && typeof body === "object" && "browserToken" in body
      ? (body as { browserToken: unknown }).browserToken
      : null;
  if (!isBrowserToken(browserToken)) {
    return NextResponse.json({ error: "Invalid browserToken" }, { status: 400 });
  }

  const cfg = paywallConfig();
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "paywall_not_configured" },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  if (!ip) {
    // Fail closed: without an IP we cannot enforce one-free-minute-per-IP.
    return NextResponse.json(
      { error: "Could not determine your address; try again." },
      { status: 400 },
    );
  }
  const ipHash = hashIp(ip);

  // 1. Has this IP hash already claimed its free minute?
  const { data: ipRow } = await supabase
    .from("don_paywall_ip")
    .select("ip_hash")
    .eq("ip_hash", ipHash)
    .maybeSingle();
  let claimedNow = false;
  if (!ipRow) {
    const { error: insertErr } = await supabase
      .from("don_paywall_ip")
      .insert({ ip_hash: ipHash, free_used: true });
    if (!insertErr) {
      claimedNow = true; // this mint is the IP's one free minute
    } else if (String(insertErr.code) !== "23505") {
      console.error("[don/session] ip claim insert failed:", insertErr.message);
      return NextResponse.json(
        { error: "Could not start a session; try again." },
        { status: 503 },
      );
    }
    // 23505 = another concurrent mint claimed it first; free is gone.
  }

  // 2. Load or create the browser-token session ledger.
  let ledger: SessionLedger | null = null;
  const { data: existing } = await supabase
    .from("don_paywall_sessions")
    .select(
      "browser_token, ip_hash, free_seconds_granted, free_seconds_used, paid_seconds_granted, paid_seconds_used",
    )
    .eq("browser_token", browserToken)
    .maybeSingle();
  if (existing) {
    ledger = existing as SessionLedger;
  } else {
    const { data: created, error: createErr } = await supabase
      .from("don_paywall_sessions")
      .insert({
        browser_token: browserToken,
        ip_hash: ipHash,
        free_seconds_granted: claimedNow ? FREE_SECONDS : 0,
        free_seconds_used: 0,
        paid_seconds_granted: 0,
        paid_seconds_used: 0,
      })
      .select(
        "browser_token, ip_hash, free_seconds_granted, free_seconds_used, paid_seconds_granted, paid_seconds_used",
      )
      .single();
    if (createErr || !created) {
      console.error(
        "[don/session] session create failed:",
        createErr?.message,
      );
      return NextResponse.json(
        { error: "Could not start a session; try again." },
        { status: 503 },
      );
    }
    ledger = created as SessionLedger;
  }

  const remaining = remainingSeconds(ledger);
  const base = {
    sessionId: browserToken,
    secondsRemaining: remaining.total,
    freeSecondsRemaining: remaining.free,
    paidSecondsRemaining: remaining.paid,
    stageConfigured: cfg.stageReady,
    stageWsUrl: cfg.stageWsUrl || null,
  };

  // No time left: pay screen, no Anam token.
  if (remaining.total <= 0) {
    return NextResponse.json({ ...base, sessionToken: null });
  }

  // Stage not hosted yet: the hero shows "being set up", no token minted.
  if (!cfg.stageReady) {
    return NextResponse.json({ ...base, sessionToken: null });
  }

  // Mint the Anam session token on the stage server (its key never leaves it).
  let tokenRes: Response;
  try {
    tokenRes = await fetch(`${cfg.stageUrl}/api/avatar-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar: "don" }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (err) {
    console.error("[don/session] stage mint unreachable:", err);
    return NextResponse.json(
      { ...base, sessionToken: null, error: "stage_unreachable" },
      { status: 502 },
    );
  }
  const tokenData = (await tokenRes.json().catch(() => ({}))) as {
    sessionToken?: string;
    error?: string;
  };
  if (!tokenRes.ok || !tokenData.sessionToken) {
    console.error(
      "[don/session] stage mint failed:",
      tokenRes.status,
      tokenData.error,
    );
    return NextResponse.json(
      { ...base, sessionToken: null, error: "stage_mint_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ...base, sessionToken: tokenData.sessionToken });
}
