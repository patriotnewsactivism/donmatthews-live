import { NextResponse } from "next/server";
import crypto from "crypto";
import { notifyDiscord } from "@/lib/portfolio";

// GitHub webhook receiver. Hardened:
//  - No "default_secret" fallback: unset secret now disables the endpoint
//    (503) instead of accepting attacker-signable payloads.
//  - Constant-time signature comparison (timingSafeEqual).
//  - Events are forwarded to Discord so deploy/push activity is visible in
//    the same channel as the AI-team notifications — including any pushes by
//    non-human committers, which is exactly the activity worth watching.

export async function POST(request: Request) {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[webhooks] GITHUB_WEBHOOK_SECRET not set — endpoint disabled");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    const signature = request.headers.get("x-hub-signature-256");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const payload = await request.text();
    const digest =
      "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const sigBuf = Buffer.from(signature);
    const digBuf = Buffer.from(digest);
    if (sigBuf.length !== digBuf.length || !crypto.timingSafeEqual(sigBuf, digBuf)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(payload);
    const event = request.headers.get("x-github-event") || "unknown";

    if (event === "push") {
      const pusher = body.pusher?.name || body.sender?.login || "unknown";
      const repo = body.repository?.full_name || "unknown repo";
      const ref = body.ref || "";
      const commits = Array.isArray(body.commits) ? body.commits.length : 0;
      const head = body.head_commit?.message?.split("\n")[0] || "";
      void notifyDiscord(
        `🔀 **Push** to \`${repo}\` (${ref}) by **${pusher}** — ${commits} commit(s)\n${head}`,
      );
    } else {
      void notifyDiscord(
        `📡 **GitHub ${event}** on \`${body.repository?.full_name || "unknown repo"}\` by ${body.sender?.login || "unknown"}`,
      );
    }

    return NextResponse.json({ success: true, event, ref: body.ref || null });
  } catch (error) {
    console.error("Error in webhook route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
