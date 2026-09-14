import { requestVoiceBaseUrl } from "@/lib/don-voice-vercel";
import { timingSafeEqualStr } from "../../../../../../voice-agent/src/audio";
import { config } from "../../../../../../voice-agent/src/config";
import { provisionManagedAssistant } from "../../../../../../voice-agent/src/telnyx-managed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  if (!config.adminPasscode) return false;
  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  return Boolean(supplied && timingSafeEqualStr(supplied, config.adminPasscode));
}

export async function POST(request: Request): Promise<Response> {
  if (!authorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!config.telnyxApiKey) {
    return Response.json({ error: "TELNYX_API_KEY is not configured" }, { status: 503 });
  }

  try {
    const baseUrl = requestVoiceBaseUrl(request);
    const result = await provisionManagedAssistant(baseUrl);
    return Response.json(
      {
        ok: true,
        ...result,
        baseUrl,
        model: config.telnyxModel,
        voice: config.telnyxVoice,
        transcription: config.telnyxTranscriptionModel,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("[telnyx-provision] failed:", error);
    return Response.json(
      { error: "provisioning failed", detail: String(error).slice(0, 1000) },
      { status: 502 },
    );
  }
}
