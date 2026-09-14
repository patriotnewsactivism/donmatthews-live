import { waitUntil } from "@vercel/functions";
import { handleSipWebhookBody } from "../../../../voice-agent/src/sip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request): Promise<Response> {
  const result = handleSipWebhookBody(await request.text());
  if (result.background) {
    waitUntil(
      result.background.catch((error) => {
        console.error("[sip] Vercel background session failed:", error);
      }),
    );
  }

  return Response.json(result.body, {
    status: result.status,
    headers: { "cache-control": "no-store" },
  });
}
