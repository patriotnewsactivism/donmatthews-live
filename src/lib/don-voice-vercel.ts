import { config } from "../../voice-agent/src/config";
import { memoryAvailable } from "../../voice-agent/src/memory";
import { getManagedAssistantId, managedWebhookToken } from "../../voice-agent/src/telnyx-managed";
import { aiAssistantTeXml, parseVoiceWebhook, streamUrl, voiceTeXml } from "../../voice-agent/src/telephony";

const XML_HEADERS = {
  "content-type": "text/xml; charset=utf-8",
  "cache-control": "no-store",
};

function normalizePublicBaseUrl(value: string): string {
  const url = new URL(value);
  if (url.hostname.toLowerCase() === "donmatthews.live") {
    url.hostname = "www.donmatthews.live";
  }
  url.pathname = "";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/+$/, "");
}

export function requestVoiceBaseUrl(request: Request): string {
  const configured = process.env.PUBLIC_BASE_URL?.trim();
  if (configured) {
    try {
      return normalizePublicBaseUrl(configured);
    } catch {
      console.warn("[voice] PUBLIC_BASE_URL is invalid; falling back to request origin");
    }
  }
  return normalizePublicBaseUrl(new URL(request.url).origin);
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
  const managedAssistantId = await getManagedAssistantId();
  if (managedAssistantId) {
    console.log(`[voice] managed Telnyx assistant ${managedAssistantId} selected`);
    return new Response(aiAssistantTeXml(managedAssistantId), {
      status: 200,
      headers: XML_HEADERS,
    });
  }

  if (config.xaiApiKey) {
    const body = request.method === "POST" ? await request.text() : "";
    const contentType = request.headers.get("content-type") ?? "";
    const caller = parseVoiceWebhook(body, contentType);
    const baseUrl = requestVoiceBaseUrl(request);
    const xml = voiceTeXml(streamUrl(baseUrl, config.streamToken), caller.from, caller.to);
    console.warn("[voice] managed assistant unavailable; using legacy xAI/WebSocket fallback");
    return new Response(xml, {
      status: 200,
      headers: XML_HEADERS,
    });
  }

  console.error("[voice] neither TELNYX_ASSISTANT_ID nor XAI_API_KEY is available");
  return new Response(unavailableTeXml(), {
    status: 200,
    headers: XML_HEADERS,
  });
}

export async function handleVoiceHealth(): Promise<Response> {
  const managedAssistantId = await getManagedAssistantId();
  const managedReady = Boolean(managedAssistantId);
  const legacyReady = Boolean(config.xaiApiKey && config.xaiAgentId);
  const ok = managedReady || legacyReady;

  return Response.json(
    {
      ok,
      service: "don-voice-agent",
      platform: "vercel",
      mode: managedReady ? "telnyx-managed" : legacyReady ? "xai-websocket-fallback" : "unconfigured",
      memory: memoryAvailable() ? "supabase" : "disabled",
      admin: config.githubToken ? "configured" : "disabled",
      ownerAccess: config.adminPasscode ? "configured" : "disabled",
      telnyx: {
        assistant: managedReady ? "configured" : "missing",
        provisioningApi: config.telnyxApiKey ? "configured" : "missing",
        toolSecurity: managedWebhookToken() ? "configured" : "missing",
        model: config.telnyxModel,
        voice: config.telnyxVoice,
        stt: config.telnyxTranscriptionModel,
        texmlApp: config.telnyxTexmlAppId ? "configured" : "optional",
        callerId: config.telnyxCallerId ? "configured" : "optional",
      },
      legacy: {
        agent: Boolean(config.xaiAgentId),
        xai: config.xaiApiKey ? "configured" : "missing",
      },
    },
    {
      status: ok ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}
