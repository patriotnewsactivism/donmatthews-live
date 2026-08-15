import { NextResponse } from "next/server";

// Creates a Stripe Checkout Session for the $1.99 paid digital download of a
// single, once its first-100-free cap has been claimed out. Payment is
// verified server-side on return (api/single-checkout-verify) — never trust
// the client, and never deliver the file until Stripe confirms paid.

const TRACKS: Record<string, { title: string }> = {
  "happy-fuck-the-cops-day": { title: "Happy Fuck The Cops Day" },
};

export async function POST(request: Request) {
  try {
    const { email, track } = await request.json();
    const trackSlug = track || "happy-fuck-the-cops-day";
    const trackInfo = TRACKS[trackSlug];
    if (!trackInfo) {
      return NextResponse.json({ error: "Unknown track" }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.SINGLE_DOWNLOAD_PRICE_ID;
    if (!stripeKey || !priceId) {
      console.error("[single-checkout] Stripe not configured");
      return NextResponse.json({ error: "Payments not configured" }, { status: 500 });
    }

    const origin = request.headers.get("origin") || "https://donmatthews.live";

    const params = new URLSearchParams({
      mode: "payment",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${origin}/?single_checkout_session_id={CHECKOUT_SESSION_ID}&track=${trackSlug}#single-release`,
      cancel_url: `${origin}/?checkout=cancelled&track=${trackSlug}#single-release`,
      "metadata[track_slug]": trackSlug,
    });
    if (email) params.append("customer_email", email);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: AbortSignal.timeout(8000),
    });

    if (!stripeRes.ok) {
      console.error("[single-checkout] Stripe error:", await stripeRes.text());
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    const session = await stripeRes.json();
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error in single-checkout route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
