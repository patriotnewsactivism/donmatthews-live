// POST /api/don/webhook — Stripe webhook: credit purchased minutes.
//
// On checkout.session.completed, credits pack_minutes * 60 paid seconds to
// the browser-token session in metadata. That is the only event that adds
// paid time — nothing is credited at checkout creation, so a cancelled or
// unpaid checkout buys nothing.
//
// Verify the signature with STRIPE_WEBHOOK_SECRET. A bad signature is a
// 400, not a credit.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin, paywallConfig } from "@/lib/don-paywall";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const cfg = paywallConfig();
  if (!cfg.stripeReady || !cfg.webhookSecret) {
    return NextResponse.json(
      { error: "payments_not_configured" },
      { status: 503 },
    );
  }
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  const rawBody = await request.text();
  const stripe = new Stripe(cfg.stripeKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, cfg.webhookSecret);
  } catch (err) {
    console.error("[don/webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const browserToken = session.metadata?.browser_token || "";
  const packMinutes = Number(session.metadata?.pack_minutes || 0);
  if (!browserToken || !packMinutes || packMinutes <= 0) {
    console.error("[don/webhook] completed checkout without token/minutes:", session.id);
    return NextResponse.json({ received: true, ignored: "missing-metadata" });
  }
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, ignored: "unpaid" });
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
    .select("paid_seconds_granted")
    .eq("browser_token", browserToken)
    .maybeSingle();
  if (!data) {
    console.error("[don/webhook] unknown browser token:", session.id);
    return NextResponse.json({ received: true, ignored: "unknown-session" });
  }
  const { error } = await supabase
    .from("don_paywall_sessions")
    .update({
      paid_seconds_granted:
        (data as { paid_seconds_granted: number }).paid_seconds_granted +
        packMinutes * 60,
      stripe_checkout_session_id: session.id,
    })
    .eq("browser_token", browserToken);
  if (error) {
    console.error("[don/webhook] credit failed:", error.message);
    return NextResponse.json({ error: "Credit failed" }, { status: 503 });
  }
  return NextResponse.json({ received: true, creditedSeconds: packMinutes * 60 });
}
