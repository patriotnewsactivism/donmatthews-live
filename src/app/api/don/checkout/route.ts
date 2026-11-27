// POST /api/don/checkout — buy more minutes with Don.
//
// Body: { "browserToken": "<uuid>", "pack": "5" | "10" | "20" }
//
// Creates a one-time Stripe Checkout session at the $1/minute rate:
// $5 = 5 min, $10 = 10 min, $20 = 20 min. No subscription, no account.
// Prices are inline (price_data), so no Stripe Dashboard products are
// needed — only the API keys in env.
// Minutes are credited by the Stripe webhook (/api/don/webhook) on
// checkout.session.completed, keyed by the browser token in metadata.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  MINUTE_PACKS,
  getSupabaseAdmin,
  isBrowserToken,
  isPackKey,
  paywallConfig,
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
  const { browserToken, pack } = body;
  if (!isBrowserToken(browserToken)) {
    return NextResponse.json({ error: "Invalid browserToken" }, { status: 400 });
  }
  if (!isPackKey(pack)) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }
  const chosen = MINUTE_PACKS[pack];

  const cfg = paywallConfig();
  if (!cfg.stripeReady) {
    return NextResponse.json(
      { error: "payments_not_configured" },
      { status: 503 },
    );
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "paywall_not_configured" },
      { status: 503 },
    );
  }
  const { data: session } = await supabase
    .from("don_paywall_sessions")
    .select("browser_token")
    .eq("browser_token", browserToken)
    .maybeSingle();
  if (!session) {
    return NextResponse.json(
      { error: "No conversation session yet — talk to Don first." },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const stripe = new Stripe(cfg.stripeKey);
  let checkout: Stripe.Checkout.Session;
  try {
    checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: chosen.amountCents,
            product_data: {
              name: `Talk with Don — ${chosen.minutes} minutes`,
              description:
                "One-time payment. Every dollar funds the investigations and the projects.",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        browser_token: browserToken,
        pack_minutes: String(chosen.minutes),
      },
      success_url: `${origin}/?don_paid=1`,
      cancel_url: `${origin}/`,
    });
  } catch (err) {
    console.error("[don/checkout] Stripe error:", err);
    return NextResponse.json(
      { error: "Could not start checkout; try again." },
      { status: 502 },
    );
  }
  if (!checkout.url) {
    return NextResponse.json(
      { error: "Could not start checkout; try again." },
      { status: 502 },
    );
  }
  return NextResponse.json({ checkoutUrl: checkout.url });
}
