import { NextResponse } from "next/server";
import { forwardLeadToBuildMyBot } from "@/lib/portfolio";

// Verifies a returned Stripe Checkout Session server-side (never trusts the
// client) and delivers the download by email exactly once per session_id,
// enforced by a unique constraint on single_purchases.session_id.

const TRACKS: Record<string, { title: string; fileUrl: string }> = {
  "happy-fuck-the-cops-day": {
    title: "Happy Fuck The Cops Day",
    fileUrl: "https://donmatthews.live/audio/happy-fuck-the-cops-day.mp3",
  },
};

const NOTIFY_EMAIL = "don@donmatthews.live";
const FROM = "Bad Actors <downloads@donmatthews.live>";

async function sendResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[Resend] send failed:", await res.text());
  } catch (err) {
    console.error("[Resend] send error:", err);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id is required" }, { status: 400 });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supabaseUrl = process.env.SINGLES_SUPABASE_URL;
  const supabaseKey = process.env.SINGLES_SUPABASE_SERVICE_ROLE_KEY;
  if (!stripeKey || !supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${stripeKey}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!stripeRes.ok) return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    const session = await stripeRes.json();

    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false });
    }

    const trackSlug = session.metadata?.track_slug || "happy-fuck-the-cops-day";
    const trackInfo = TRACKS[trackSlug];
    if (!trackInfo) return NextResponse.json({ error: "Unknown track" }, { status: 400 });

    const email: string | undefined = session.customer_details?.email || session.customer_email;

    // Insert-or-detect-duplicate: unique constraint on session_id means a
    // second verify call (e.g. page refresh) hits a conflict and we just
    // re-serve the link without re-sending the email.
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/single_purchases`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        session_id: sessionId,
        track_slug: trackSlug,
        email: email || "unknown",
        amount_cents: session.amount_total,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (insertRes.ok && email) {
      void forwardLeadToBuildMyBot(email, "donmatthews.live/happy-fuck-the-cops-day-purchase");
      void sendResend(
        email,
        `Your purchase: ${trackInfo.title}`,
        `<p>Thanks for buying <strong>${trackInfo.title}</strong>! Here's your download:</p>
         <p><a href="${trackInfo.fileUrl}">${trackInfo.fileUrl}</a></p>
         <p>Truth. Justice. Accountability.<br/>— Don Matthews</p>`
      );
      void sendResend(
        NOTIFY_EMAIL,
        `New paid download: ${trackInfo.title}`,
        `<p>${email} just paid $${(session.amount_total / 100).toFixed(2)} for "${trackInfo.title}" on donmatthews.live.</p>`
      );
    }

    return NextResponse.json({ paid: true, downloadUrl: trackInfo.fileUrl });
  } catch (error) {
    console.error("Error in single-checkout-verify route:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
