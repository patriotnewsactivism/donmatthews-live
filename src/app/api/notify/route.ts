import { NextResponse } from "next/server";
import { forwardLeadToBuildMyBot, notifyDiscord } from "@/lib/portfolio";

// Launch-notification capture → BuildMyBot CRM (deduped there by email), with
// Discord as the redundant channel. Replaces the ephemeral /tmp/notify.json
// store that lost every subscriber on container restart.

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const result = await forwardLeadToBuildMyBot(email, "donmatthews.live/notify", name);

    if (result.forwarded) {
      void notifyDiscord(`🔔 **Notify-me signup** — ${email} (lead ${result.leadId ?? "created"})`);
      return NextResponse.json({ success: true, message: "Subscription successful!" });
    }

    console.error("[notify] CRM forward failed:", result.error);
    await notifyDiscord(
      `⚠️ **Notify capture NOT saved to CRM** — ${email}\nReason: ${result.error}\nAdd manually or fix PORTFOLIO_INTAKE_SECRET / BUILDMYBOT_INTAKE_URL.`,
    );
    const captured = Boolean(process.env.DISCORD_WEBHOOK_URL);
    return captured
      ? NextResponse.json({ success: true, message: "Subscription successful!" })
      : NextResponse.json({ error: "Signup is temporarily unavailable" }, { status: 503 });
  } catch (error) {
    console.error("Error in notify route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
