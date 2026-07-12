// Portfolio pipeline: donmatthews.live is a lead source for BuildMyBot.app.
// Every capture is forwarded into the BuildMyBot CRM, where the autonomous
// lead-followup agent nurtures it. Discord is the redundant human-visible
// channel so a capture is never silent even if the CRM forward fails.
//
// Env (Railway → Variables):
//   BUILDMYBOT_INTAKE_URL      default https://www.buildmybot.app/api/leads/capture
//   PORTFOLIO_INTAKE_SECRET    must match the same var on the BuildMyBot Vercel project
//   DISCORD_WEBHOOK_URL        optional backup notification channel

const INTAKE_URL =
  process.env.BUILDMYBOT_INTAKE_URL ||
  "https://www.buildmybot.app/api/leads/capture";

export interface LeadForwardResult {
  forwarded: boolean;
  leadId?: string;
  error?: string;
}

/** Push a captured email into the BuildMyBot CRM as a portfolio lead. */
export async function forwardLeadToBuildMyBot(
  email: string,
  source: string,
  name?: string,
): Promise<LeadForwardResult> {
  const secret = process.env.PORTFOLIO_INTAKE_SECRET;
  if (!secret) {
    return { forwarded: false, error: "PORTFOLIO_INTAKE_SECRET not configured" };
  }
  try {
    const res = await fetch(INTAKE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-portfolio-secret": secret,
      },
      body: JSON.stringify({ portfolio: true, email, name: name || "", source }),
      // A hung CRM must not hang the marketing site's form submit.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = await res.text();
      return { forwarded: false, error: `CRM returned ${res.status}: ${body.slice(0, 200)}` };
    }
    const data = (await res.json()) as { leadId?: string };
    return { forwarded: true, leadId: data.leadId };
  } catch (err) {
    return {
      forwarded: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Best-effort Discord ping. Failures are swallowed — never break the caller. */
export async function notifyDiscord(text: string): Promise<void> {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "donmatthews.live",
        content: text.slice(0, 1900),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[discord] webhook post failed:", err);
  }
}
