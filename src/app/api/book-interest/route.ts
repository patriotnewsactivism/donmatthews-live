import { NextResponse } from "next/server";
import { forwardLeadToBuildMyBot, notifyDiscord } from "@/lib/portfolio";

const SUPABASE_URL = "https://evkjlnbpntimbxklnhoz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Y1T9LKB0riaKXzzDa27zeA_g7zgx9kp";

const formats = {
  paperback: { label: "Paperback", price: "$25.99" },
  hardback: { label: "Hardback", price: "$35.99" },
  audiobook: { label: "Audiobook — read by author", price: "$15" },
  ebook: { label: "eBook — free with a donation of any amount", price: "FREE" },
} as const;

type FormatKey = keyof typeof formats;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const mode = body.mode === "preorder" ? "preorder" : body.mode === "interest" ? "interest" : "";

    if (!email || !email.includes("@") || email.length > 320) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    if (!mode) {
      return NextResponse.json({ error: "Invalid signup type" }, { status: 400 });
    }

    let format: FormatKey | null = null;
    if (mode === "preorder") {
      if (typeof body.format !== "string" || !(body.format in formats)) {
        return NextResponse.json({ error: "Choose a valid edition" }, { status: 400 });
      }
      format = body.format as FormatKey;
    }

    const eventType = mode === "preorder" ? "american_injustice_preorder" : "american_injustice_interest";
    const source = mode === "preorder" && format
      ? `donmatthews.live/american-injustice/preorder/${format}`
      : "donmatthews.live/american-injustice/interest";
    const selected = format ? formats[format] : null;

    const eventResponse = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_events`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        email,
        event_type: eventType,
        source,
        metadata: {
          name,
          format,
          edition: selected?.label ?? null,
          advertisedPrice: selected?.price ?? null,
          paymentStatus: "not_collected",
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!eventResponse.ok) {
      const detail = await eventResponse.text();
      console.error("[book-interest] durable event insert failed:", eventResponse.status, detail.slice(0, 300));
      return NextResponse.json({ error: "Signup is temporarily unavailable" }, { status: 503 });
    }

    const eventRows = (await eventResponse.json()) as Array<{ id?: string }>;
    const eventId = eventRows[0]?.id;

    const crm = await forwardLeadToBuildMyBot(email, source, name);
    if (!crm.forwarded) {
      console.error("[book-interest] CRM sync failed after durable capture:", crm.error);
    }

    void notifyDiscord(
      mode === "preorder"
        ? `📚 **American Injustice preorder reservation** — ${selected?.label} (${selected?.price}) — ${email} — event ${eventId ?? "saved"}`
        : `📖 **American Injustice interest signup** — ${email} — event ${eventId ?? "saved"}`,
    );

    return NextResponse.json({
      success: true,
      eventId,
      message: mode === "preorder" ? "Preorder interest saved" : "Interest signup saved",
    });
  } catch (error) {
    console.error("[book-interest] error:", error);
    return NextResponse.json({ error: "Unable to save your request" }, { status: 500 });
  }
}
