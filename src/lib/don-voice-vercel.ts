import { config } from "../../voice-agent/src/config";
import { memoryAvailable } from "../../voice-agent/src/memory";
import { parseVoiceWebhook, streamUrl, voiceTeXml } from "../../voice-agent/src/telephony";

const XML_HEADERS = {
  "content-type": "text/xml; charset=utf-8",
  "cache-control": "no-store",
};

function requestBaseUrl(request: Request): string {
  const configured = process.env.PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return new URL(request.url).origin.replace(/\/+$/, "");
}

function unavailableTeXml(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<Response>",
    "  <Say>The Don Matthews voice assistant is temporarily unavailable while its voice service is being configured. Please try again shortly.</Say>",
    "  <Hangup/>",
    "</Response>",
  ].join("\n");
}

export async function handleVoiceRequest(request: Request): Promise<Response> {
  if (!config.xaiApiKey) {
    console.error("[voice] XAI_API_KEY missing; refusing to open a media stream");
    return new Response(unavailableTeXml(), {
      status: 200,
      headers: XML_HEADERS,
    });
  }

  const body = request.method === "POST" ? await request.text() : "";
  const contentType = request.headers.get("content-type") ?? "";
  const caller = parseVoiceWebhook(body, contentType);
  const baseUrl = requestBaseUrl(request);
  const xml = voiceTeXml(streamUrl(baseUrl, config.streamToken), caller.from, caller.to);

  return new Response(xml, {
    status: 200,
    headers: XML_HEADERS,
  });
}

export function handleVoiceHealth(): Response {
  const xaiConfigured = Boolean(config.xaiApiKey);

  return Response.json(
    {
      ok: xaiConfigured,
      service: "don-voice-agent",
      platform: "vercel",
      memory: memoryAvailable() ? "supabase" : "disabled",
      admin: config.githubToken ? "configured" : "disabled",
      ownerAccess: config.adminPasscode ? "configured" : "disabled",
      agent: Boolean(config.xaiAgentId),
      xai: xaiConfigured ? "configured" : "missing",
    },
    {
      status: xaiConfigured ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}
