import { config } from "../../voice-agent/src/config";
import { memoryAvailable } from "../../voice-agent/src/memory";
import { parseVoiceWebhook, streamUrl, voiceTeXml } from "../../voice-agent/src/telephony";

function requestBaseUrl(request: Request): string {
  const configured = process.env.PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return new URL(request.url).origin.replace(/\/+$/, "");
}

export async function handleVoiceRequest(request: Request): Promise<Response> {
  const body = request.method === "POST" ? await request.text() : "";
  const contentType = request.headers.get("content-type") ?? "";
  const caller = parseVoiceWebhook(body, contentType);
  const baseUrl = requestBaseUrl(request);
  const xml = voiceTeXml(streamUrl(baseUrl, config.streamToken), caller.from, caller.to);

  return new Response(xml, {
    status: 200,
    headers: {
      "content-type": "text/xml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function handleVoiceHealth(): Response {
  return Response.json(
    {
      ok: true,
      service: "don-voice-agent",
      platform: "vercel",
      memory: memoryAvailable() ? "supabase" : "disabled",
      admin: config.githubToken ? "configured" : "disabled",
      ownerAccess: config.adminPasscode ? "configured" : "disabled",
      agent: Boolean(config.xaiAgentId),
      xai: config.xaiApiKey ? "configured" : "missing",
    },
    {
      headers: { "cache-control": "no-store" },
    },
  );
}
