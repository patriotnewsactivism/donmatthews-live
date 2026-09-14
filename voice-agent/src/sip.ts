import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { config } from "./config.js";
import { normalizePhone } from "./audio.js";
import { createSession, endSession, saveMessage, memoryAvailable } from "./memory.js";
import { XaiRealtimeClient } from "./xai.js";
import { readRequestBody } from "./telephony.js";
import type { CallSession } from "./types.js";

const sipSessions = new Map<string, { xai: XaiRealtimeClient; session: CallSession }>();

function headerValue(headers: Array<{ name?: string; value?: string }>, name: string): string {
  const match = headers.find((h) => (h.name ?? "").toLowerCase() === name.toLowerCase());
  return match?.value ?? "";
}

function phoneFromSip(value: string): string {
  const angled = /<sip:([^@>;]+)/i.exec(value)?.[1] ?? /<tel:([^>]+)/i.exec(value)?.[1];
  const raw = angled ?? value;
  return normalizePhone(raw);
}

export async function handleSipWebhook(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!config.xaiApiKey) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "XAI_API_KEY missing" }));
    return;
  }
  const body = await readRequestBody(req);
  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body) as Record<string, unknown>;
  } catch {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "invalid json" }));
    return;
  }
  if (event.type !== "realtime.call.incoming") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, ignored: event.type ?? "unknown" }));
    return;
  }
  const data = (event.data ?? {}) as Record<string, unknown>;
  const callId = String(data.call_id ?? "");
  if (!callId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "missing call_id" }));
    return;
  }
  const sipHeaders = Array.isArray(data.sip_headers)
    ? (data.sip_headers as Array<{ name?: string; value?: string }>)
    : [];
  const from = phoneFromSip(headerValue(sipHeaders, "From"));
  const to = phoneFromSip(headerValue(sipHeaders, "To"));
  joinSipCall(callId, from, to);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, call_id: callId }));
}

function joinSipCall(callId: string, from: string, to: string): void {
  const session: CallSession = {
    sessionId: randomUUID(),
    callSid: callId,
    streamSid: callId,
    callerNumber: from,
    toNumber: to,
    isOwner: from === normalizePhone(config.ownerPhone),
    sudoVerified: false,
    verifyAttempts: 0,
    startedAt: Date.now(),
    userTranscript: "",
    assistantTranscript: "",
    dtmfBuffer: "",
  };
  void createSession({
    sessionId: session.sessionId,
    callSid: session.callSid,
    callerNumber: session.callerNumber,
    isOwner: session.isOwner,
  });
  const xai = new XaiRealtimeClient(config.xaiApiKey, config.xaiAgentId, callId);
  sipSessions.set(callId, { xai, session });
  xai.open(session, {
    onAssistantAudioDelta: () => {
      /* SIP audio is played by xAI */
    },
    onAssistantTranscriptDelta: (delta) => {
      session.assistantTranscript += delta;
    },
    onAssistantTranscriptDone: (text) => {
      void saveMessage(session.sessionId, "assistant", text || session.assistantTranscript);
    },
    onUserTranscript: (text) => {
      session.userTranscript += (session.userTranscript ? " " : "") + text;
      void saveMessage(session.sessionId, "user", text);
    },
    onDtmf: (digit) => {
      if (session.sudoVerified || !/^\d$/.test(digit)) return;
      session.dtmfBuffer += digit;
      if (session.dtmfBuffer.length >= 4) {
        const code = session.dtmfBuffer.slice(0, 4);
        session.dtmfBuffer = "";
        xai.sendUserText(`My access code is ${code}.`);
      }
    },
    onError: (error) => {
      console.error(`[sip] ${callId} x.ai:`, error);
    },
    onClose: () => {
      const summary = [session.userTranscript, session.assistantTranscript]
        .filter((t) => t.trim())
        .join(" | ")
        .slice(0, 2000);
      void endSession(session.sessionId, summary || "(no conversation captured)");
      if (!memoryAvailable()) {
        console.warn("[sip] supabase not configured; session was not persisted");
      }
      sipSessions.delete(callId);
    },
  });
  console.log(`[sip] joined call ${callId} from ${from} to ${to} owner=${session.isOwner}`);
}

export function teardownSipSessions(): void {
  for (const [id, entry] of sipSessions) {
    try {
      entry.xai.close();
    } catch {
      /* noop */
    }
    sipSessions.delete(id);
  }
}
