import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-hub-signature-256");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const payload = await request.text();
    const secret = process.env.GITHUB_WEBHOOK_SECRET || "default_secret";

    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(payload).digest("hex");

    if (signature !== digest) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parsing payload
    const body = JSON.parse(payload);
    const event = request.headers.get("x-github-event") || "push";

    console.log(`Received GitHub Webhook Event: ${event}`, body);

    // Dynamic processing can happen here (e.g. triggering builds, logging deployment state, etc.)
    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      event,
      ref: body.ref || null,
    });
  } catch (error) {
    console.error("Error in webhook route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
