import { createHash } from "node:crypto";
import { timingSafeEqualStr } from "./audio.js";
import { config } from "./config.js";
import { getDb } from "./memory.js";
import { TOOL_DEFINITIONS, dispatchTool } from "./tools.js";
import type { CallSession } from "./types.js";

const ASSISTANT_MEMORY_LABEL = "telnyx_assistant_id";
const API_BASE = "https://api.telnyx.com/v2";

function normalizeNumber(value: string): string {
  return value.replace(/[^+\d]/g, "");
}

function samePhoneNumber(a: string, b: string): boolean {
  const left = normalizeNumber(a);
  const right = normalizeNumber(b);
  return Boolean(left && right && left === right);
}

export function managedWebhookToken(): string {
  if (config.telnyxToolToken) return config.telnyxToolToken;
  if (!config.telnyxApiKey) return "";
  return createHash("sha256")
    .update(`donmatthews-live:telnyx-tools:${config.telnyxApiKey}`)
    .digest("hex");
}

export function validManagedWebhookToken(value: string): boolean {
  const expected = managedWebhookToken();
  return Boolean(expected && value && timingSafeEqualStr(value, expected));
}

export async function getManagedAssistantId(): Promise<string> {
  if (config.telnyxAssistantId) return config.telnyxAssistantId;
  const db = getDb();
  if (!db) return "";
  const { data } = await db
    .from("voice_memory")
    .select("detail")
    .eq("label", ASSISTANT_MEMORY_LABEL)
    .maybeSingle<{ detail: string }>();
  return data?.detail?.trim() ?? "";
}

async function saveManagedAssistantId(assistantId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const { error } = await db.from("voice_memory").upsert(
    { label: ASSISTANT_MEMORY_LABEL, detail: assistantId },
    { onConflict: "label" },
  );
  return !error;
}

function managedInstructions(): string {
  return `
You are the official AI voice agent for Don Matthews — founder of We The People News (wtpnews.org), Civil Rights Hub (civilrightshub.org), and donmatthews.live. You answer phone calls on his behalf.

IDENTITY AND VOICE
- You are an AI voice agent. Never claim to be Don Matthews or any other human.
- Speak directly, plainly, and conversationally. Keep phone answers short unless the caller asks for detail.
- Maintain one consistent voice and persona for the entire call. Never announce or simulate a handoff unless a real tool performs one.

KNOWLEDGE
- Before answering questions about news, cases, court filings, or Don's reporting, use search_articles or latest_articles.
- If those return nothing useful, use fetch_page only for wtpnews.org, civilrightshub.org, or donmatthews.live.
- Never invent case numbers, filings, quotes, rulings, dates, or facts. Say when information is unavailable.
- Use donation_info when a caller asks how to support the work.

MEMORY
- Use remember for durable caller facts that will genuinely help later calls.
- Use recall when a caller refers to a prior call, preference, plan, or topic.

OWNER ACCESS
- If a caller identifies as Don Matthews and explicitly asks for owner/admin access, ask for the 4-digit access code and call verify_access with exactly the digits provided.
- Never volunteer that an access code exists. Never disclose or hint at the code.
- Only after verify_access succeeds may you use admin_* tools.
- Confirm destructive or consequential admin actions before executing them.

CALL CONTEXT
- Current caller: {{telnyx_end_user_target}}
- Number/agent reached: {{telnyx_agent_target}}
- Call control id: {{call_control_id}}
- Current time: {{telnyx_current_time}}

STYLE
- Answer the question, then stop. Avoid speeches and long lists on a phone call.
- If the caller is unclear, ask one focused follow-up question.
- When assistance is complete and the caller indicates they are done, politely close the call.
`.trim();
}

function managedTools(baseUrl: string, token: string): Array<Record<string, unknown>> {
  const webhookTools: Array<Record<string, unknown>> = TOOL_DEFINITIONS.map((tool) => ({
    type: "webhook",
    webhook: {
      name: tool.name,
      description: tool.description,
      url: `${baseUrl}/api/voice/telnyx/tool/${encodeURIComponent(tool.name)}`,
      method: "POST",
      async: false,
      timeout_ms: 5000,
      headers: [
        { name: "Content-Type", value: "application/json" },
        { name: "X-Don-Voice-Tool-Token", value: token },
      ],
      body_parameters: tool.parameters,
      messages: [
        {
          type: "request_response_delayed",
          content: "I'm still checking that.",
          timing_ms: 3500,
        },
      ],
    },
  }));

  webhookTools.push({
    type: "hangup",
    hangup: {
      description: "End the phone call when the caller says they are finished or asks to hang up.",
    },
  });
  return webhookTools;
}

export function buildManagedAssistantPayload(baseUrl: string): Record<string, unknown> {
  const token = managedWebhookToken();
  if (!token) throw new Error("TELNYX_API_KEY or TELNYX_TOOL_TOKEN is required for managed tool security");

  const telephonySettings: Record<string, unknown> = {
    noise_suppression: "disabled",
    time_limit_secs: 3600,
    user_idle_timeout_secs: 300,
    user_idle_reply_secs: 30,
    disable_dtmf: false,
  };
  if (config.telnyxTexmlAppId) {
    telephonySettings.default_texml_app_id = config.telnyxTexmlAppId;
  }

  return {
    name: "Don Matthews AI Voice Agent",
    description: "Managed Telnyx voice agent for donmatthews.live, with legacy xAI bridge retained only as rollback.",
    model: config.telnyxModel,
    instructions: managedInstructions(),
    greeting: "Hi, you've reached Don Matthews' AI voice agent. How can I help you?",
    tools: managedTools(baseUrl, token),
    voice_settings: {
      voice: config.telnyxVoice,
      speed: 1,
      background_audio: { type: "predefined_media", value: "silence", volume: 0 },
    },
    transcription: {
      model: config.telnyxTranscriptionModel,
      language: "en",
      settings: {
        eot_threshold: 0.8,
        eot_timeout_ms: 2500,
        eager_eot_threshold: 0.4,
        keyterm: "Don Matthews,We The People News,Civil Rights Hub,American Injustice",
      },
    },
    telephony_settings: telephonySettings,
    enabled_features: ["telephony"],
    dynamic_variables_webhook_url: `${baseUrl}/api/voice/telnyx/dynamic?token=${encodeURIComponent(token)}`,
    dynamic_variables_webhook_timeout_ms: 4000,
    privacy_settings: { data_retention: true },
    tags: ["donmatthews-live", "managed-voice", "production"],
  };
}

async function telnyxFetch(path: string, init: RequestInit): Promise<Record<string, unknown>> {
  if (!config.telnyxApiKey) throw new Error("TELNYX_API_KEY is not configured");
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.telnyxApiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await response.text();
  let body: Record<string, unknown> = {};
  try {
    body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    body = { raw: text.slice(0, 1000) };
  }
  if (!response.ok) {
    const detail = typeof body.errors === "object" ? JSON.stringify(body.errors) : text;
    throw new Error(`Telnyx ${response.status}: ${detail.slice(0, 1200)}`);
  }
  return body;
}

export async function provisionManagedAssistant(baseUrl: string): Promise<{
  assistantId: string;
  created: boolean;
  persisted: boolean;
}> {
  const payload = buildManagedAssistantPayload(baseUrl);
  const existingId = await getManagedAssistantId();
  const body = existingId
    ? await telnyxFetch(`/ai/assistants/${encodeURIComponent(existingId)}`, {
        method: "POST",
        body: JSON.stringify({ ...payload, promote_to_main: true }),
      })
    : await telnyxFetch("/ai/assistants", {
        method: "POST",
        body: JSON.stringify(payload),
      });
  const assistantId = String(body.id ?? existingId ?? "").trim();
  if (!assistantId) throw new Error("Telnyx did not return an assistant id");
  const persisted = config.telnyxAssistantId ? true : await saveManagedAssistantId(assistantId);
  return { assistantId, created: !existingId, persisted };
}

interface StoredVoiceSession {
  session_id: string;
  call_sid: string | null;
  caller_number: string;
  is_owner: boolean;
  sudo_verified: boolean;
  verify_attempts: number;
  started_at: string | null;
}

export async function ensureManagedSession(
  callControlId: string,
  callerNumber = "",
): Promise<CallSession> {
  const db = getDb();
  const sessionId = callControlId || `telnyx-${Date.now()}`;
  const normalizedCaller = callerNumber || "unknown";
  const isOwner = samePhoneNumber(normalizedCaller, config.ownerPhone);

  if (db) {
    const { data: existing } = await db
      .from("voice_sessions")
      .select("session_id,call_sid,caller_number,is_owner,sudo_verified,verify_attempts,started_at")
      .eq("session_id", sessionId)
      .maybeSingle<StoredVoiceSession>();

    if (!existing) {
      await db.from("voice_sessions").upsert(
        {
          session_id: sessionId,
          call_sid: callControlId || sessionId,
          caller_number: normalizedCaller,
          is_owner: isOwner,
        },
        { onConflict: "session_id" },
      );
    }

    const { data: row } = await db
      .from("voice_sessions")
      .select("session_id,call_sid,caller_number,is_owner,sudo_verified,verify_attempts,started_at")
      .eq("session_id", sessionId)
      .maybeSingle<StoredVoiceSession>();

    if (row) {
      return {
        sessionId: row.session_id,
        callSid: row.call_sid ?? callControlId ?? row.session_id,
        streamSid: `managed:${row.session_id}`,
        callerNumber: row.caller_number,
        toNumber: "",
        isOwner: row.is_owner,
        sudoVerified: row.sudo_verified,
        verifyAttempts: row.verify_attempts,
        startedAt: row.started_at ? new Date(row.started_at).getTime() : Date.now(),
        userTranscript: "",
        assistantTranscript: "",
        dtmfBuffer: "",
      };
    }
  }

  return {
    sessionId,
    callSid: callControlId || sessionId,
    streamSid: `managed:${sessionId}`,
    callerNumber: normalizedCaller,
    toNumber: "",
    isOwner,
    sudoVerified: false,
    verifyAttempts: 0,
    startedAt: Date.now(),
    userTranscript: "",
    assistantTranscript: "",
    dtmfBuffer: "",
  };
}

export async function initializeManagedCall(payload: Record<string, unknown>): Promise<Record<string, string>> {
  const envelope = payload.data && typeof payload.data === "object"
    ? (payload.data as Record<string, unknown>)
    : payload;
  const callPayload = envelope.payload && typeof envelope.payload === "object"
    ? (envelope.payload as Record<string, unknown>)
    : envelope;

  const callControlId = String(
    callPayload.call_control_id ?? callPayload.callControlId ?? callPayload.call_session_id ?? "",
  );
  const callerNumber = String(
    callPayload.telnyx_end_user_target ?? callPayload.from ?? callPayload.From ?? "",
  );
  const agentTarget = String(
    callPayload.telnyx_agent_target ?? callPayload.to ?? callPayload.To ?? "",
  );
  const session = await ensureManagedSession(callControlId, callerNumber);

  return {
    caller_number: callerNumber,
    agent_target: agentTarget,
    owner_candidate: session.isOwner ? "yes" : "no",
  };
}

export async function executeManagedTool(
  toolName: string,
  callControlId: string,
  args: Record<string, unknown>,
): Promise<string> {
  if (!TOOL_DEFINITIONS.some((tool) => tool.name === toolName)) {
    throw new Error(`Unknown managed voice tool: ${toolName}`);
  }
  const session = await ensureManagedSession(callControlId);
  return dispatchTool(session, toolName, args);
}

export async function placeManagedOutboundCall(to: string): Promise<Record<string, unknown>> {
  if (!/^\+[1-9]\d{7,14}$/.test(to)) throw new Error("Destination must be an E.164 phone number");
  if (!config.telnyxTexmlAppId) throw new Error("TELNYX_TEXML_APP_ID is not configured");
  if (!config.telnyxCallerId) throw new Error("TELNYX_CALLER_ID is not configured");
  const assistantId = await getManagedAssistantId();
  if (!assistantId) throw new Error("No Telnyx managed assistant id is configured");
  return telnyxFetch(`/texml/ai_calls/${encodeURIComponent(config.telnyxTexmlAppId)}`, {
    method: "POST",
    body: JSON.stringify({
      From: config.telnyxCallerId,
      To: to,
      AIAssistantId: assistantId,
    }),
  });
}
