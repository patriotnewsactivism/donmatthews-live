import { NextResponse } from "next/server";
import { forwardLeadToBuildMyBot, notifyDiscord } from "@/lib/portfolio";

// Waitlist capture → BuildMyBot CRM (nurtured by the AI lead-followup agent),
// with Discord as the redundant channel. The previous implementation wrote to
// /tmp/waitlist.json — ephemeral on Railway, so every restart deleted the
// entire list. Captures now go to durable storage or fail loudly.

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const result = await forwardLeadToBuildMyBot(email, "donmatthews.live/waitlist", name);

    if (result.forwarded) {
      // Fire-and-forget: signup UX never waits on Discord.
      void notifyDiscord(`📝 **Waitlist signup** — ${email} (lead ${result.leadId ?? "created"})`);
      return NextResponse.json({ success: true, message: "Added to waitlist successfully!" });
    }

    // CRM unreachable/misconfigured: Discord becomes the capture of record so
    // the lead is never silently lost, and the error is logged for ops.
    console.error("[waitlist] CRM forward failed:", result.error);
    await notifyDiscord(
      `⚠️ **Waitlist capture NOT saved to CRM** — ${email}\nReason: ${result.error}\nAdd manually or fix PORTFOLIO_INTAKE_SECRET / BUILDMYBOT_INTAKE_URL.`,
    );
    const captured = Boolean(process.env.DISCORD_WEBHOOK_URL);
    return captured
      ? NextResponse.json({ success: true, message: "Added to waitlist successfully!" })
      : NextResponse.json({ error: "Signup is temporarily unavailable" }, { status: 503 });
  } catch (error) {
    console.error("Error in waitlist route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
