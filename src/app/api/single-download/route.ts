import { NextResponse } from "next/server";
import { forwardLeadToBuildMyBot } from "@/lib/portfolio";

// Free-download promo for standalone singles (e.g. "Happy Fuck The Cops Day").
// Caps free claims at N (default 100) per track via an atomic Postgres RPC
// (claim_single_download) that advisory-locks per track_slug, so concurrent
// hits near the cap can't overshoot it. Delivers the actual mp3 by email via
// Resend once claimed. Re-submitting the same email just re-sends the link
// instead of eating another slot.

const TRACKS: Record<string, { title: string; fileUrl: string }> = {
  "happy-fuck-the-cops-day": {
    title: "Happy Fuck The Cops Day",
    fileUrl: "https://donmatthews.live/audio/happy-fuck-the-cops-day.mp3",
  },
};

const NOTIFY_EMAIL = "don@donmatthews.live";
const FROM = "Bad Actors <downloads@donmatthews.live>";
const CAP = 100;

async function sendResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return { ok: false, error: await res.text() };
  return { ok: true };
}

const RESEND_AUDIENCE_ID = "84a4fdbe-9ac9-46bd-94b0-f6364742f44d";

// Upserts the contact into our one Resend audience so we always have a
// remarketable list going forward -- the earlier album-subscriber list was
// lost when its Supabase project got deleted, because nothing was ever
// mirrored into an audience. This closes that gap for every future signup.
async function upsertResendAudience(email: string, firstName?: string) {
  const apiKey = process.env.RESEND_AUDIENCE_API_KEY;
  if (!apiKey) return;
  try {
    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, first_name: firstName || undefined, unsubscribed: false }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok && res.status !== 409) {
      console.error("[Resend audience] upsert failed:", await res.text());
    }
  } catch (err) {
    console.error("[Resend audience] upsert error:", err);
  }
}

export async function POST(request: Request) {
  try {
    const { email, name, track } = await request.json();
    const trackSlug = track || "happy-fuck-the-cops-day";
    const trackInfo = TRACKS[trackSlug];

    if (!trackInfo) {
      return NextResponse.json({ error: "Unknown track" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabaseUrl = process.env.SINGLES_SUPABASE_URL;
    const supabaseKey = process.env.SINGLES_SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error("[single-download] Singles Supabase not configured");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/claim_single_download`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_track_slug: trackSlug,
        p_email: cleanEmail,
        p_name: name || null,
        p_source: "donmatthews.live",
        p_cap: CAP,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!rpcRes.ok) {
      console.error("[single-download] Supabase RPC error:", await rpcRes.text());
      return NextResponse.json({ error: "Failed to process claim" }, { status: 500 });
    }

    const result = await rpcRes.json();

    if (!result.claimed) {
      return NextResponse.json({ success: false, soldOut: true, remaining: 0 });
    }

    void forwardLeadToBuildMyBot(cleanEmail, "donmatthews.live/happy-fuck-the-cops-day", name);
    void upsertResendAudience(cleanEmail, name);

    const fanEmail = await sendResend(
      cleanEmail,
      `Your free download: ${trackInfo.title}`,
      `<p>Hey${name ? " " + name : ""},</p>
       <p>Thanks for grabbing <strong>${trackInfo.title}</strong> — you're one of the first 100 free downloads. Here's your file:</p>
       <p><a href="${trackInfo.fileUrl}">${trackInfo.fileUrl}</a></p>
       <p>Truth. Justice. Accountability.<br/>— Don Matthews</p>`
    );

    if (!result.already_claimed) {
      void sendResend(
        NOTIFY_EMAIL,
        `New free download: ${trackInfo.title}`,
        `<p>${cleanEmail}${name ? ` (${name})` : ""} just claimed free download #${CAP - result.remaining} of ${CAP} for "${trackInfo.title}" from donmatthews.live. ${result.remaining} remaining.</p>`
      );
    }

    if (!fanEmail.ok) {
      console.error("[single-download] Resend send failed:", fanEmail.error);
      // Don't fail the request — the download link is still returned directly.
    }

    return NextResponse.json({
      success: true,
      alreadyClaimed: !!result.already_claimed,
      remaining: result.remaining,
      downloadUrl: trackInfo.fileUrl,
    });
  } catch (error) {
    console.error("Error in single-download route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
