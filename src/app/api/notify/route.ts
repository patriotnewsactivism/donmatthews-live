import { NextResponse } from "next/server";
import { forwardLeadToBuildMyBot, notifyDiscord } from "@/lib/portfolio";

// Launch-notification capture → BuildMyBot CRM (persisted in Supabase), with
// Discord as the redundant human-visible channel. No ephemeral filesystem use.

export async function POST(request: Request) {
  try {
    const { email, name, source } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const normalizedSource =
      typeof source === "string" && source.trim()
        ? source.trim().slice(0, 120)
        : "donmatthews.live/notify";

    const result = await forwardLeadToBuildMyBot(email, normalizedSource, name);

    if (result.forwarded) {
      void notifyDiscord(
        `🔔 **Notify-me signup** — ${email} — ${normalizedSource} (lead ${result.leadId ?? "created"})`,
      );
      return NextResponse.json({ success: true, message: "Subscription successful!" });
    }

    console.error("[notify] CRM forward failed:", result.error);
    await notifyDiscord(
      `⚠️ **Notify capture NOT saved to CRM** — ${email}\nSource: ${normalizedSource}\nReason: ${result.error}\nAdd manually or fix PORTFOLIO_INTAKE_SECRET / BUILDMYBOT_INTAKE_URL.`,
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
