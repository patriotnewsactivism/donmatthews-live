import { NextResponse } from "next/server";
import { forwardLeadToBuildMyBot, notifyDiscord } from "@/lib/portfolio";

// Free album download capture for "Bad Actors - Volume 1". Delivers the real,
// correctly-ordered 17-track zip via email (not just a streaming-service
// link) and pings Don so he can confirm the funnel is actually working.

const ZIP_URL = "https://donmatthews.live/bad-actors-volume-1.zip";
const NOTIFY_EMAIL = "don@donmatthews.live";
const FROM = "Bad Actors <downloads@donmatthews.live>";

async function sendResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return { ok: false, error: await res.text() };
  return { ok: true };
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Track the lead in the same CRM pipeline as everything else on the site.
    void forwardLeadToBuildMyBot(email, "donmatthews.live/bad-actors-download", name);

    const fanEmail = await sendResend(
      email,
      "Your free download: Bad Actors - Volume 1",
      `<p>Hey${name ? " " + name : ""},</p>
       <p>Thanks for checking out <strong>Bad Actors - Volume 1</strong>. Here's your free download — all 17 tracks, in order, zipped up and ready to go:</p>
       <p><a href="${ZIP_URL}">${ZIP_URL}</a></p>
       <p>Truth. Justice. Accountability.<br/>— Don Matthews</p>`
    );

    void sendResend(
      NOTIFY_EMAIL,
      "New Bad Actors download signup",
      `<p>${email}${name ? ` (${name})` : ""} just downloaded Bad Actors - Volume 1 from donmatthews.live.</p>`
    );

    if (!fanEmail.ok) {
      console.error("[album-download] Resend send failed:", fanEmail.error);
      void notifyDiscord(`⚠️ **Album download email failed** for ${email}: ${fanEmail.error}`);
      // Don't fail the request — the download link is still shown directly in the UI.
    }

    return NextResponse.json({ success: true, downloadUrl: ZIP_URL });
  } catch (error) {
    console.error("Error in album-download route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
