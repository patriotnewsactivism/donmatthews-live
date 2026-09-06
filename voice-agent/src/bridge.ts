import { randomUUID } from "node:crypto";
import WebSocket from "ws";
import type { CallSession } from "./types.js";
import { config } from "./config.js";
import { normalizePhone, ulawSamplesToXaiBytes, xaiBytesToUlaw22ms } from "./audio.js";
import { createSession, endSession, saveMessage, memoryAvailable } from "./memory.js";
import { XaiRealtimeClient } from "./xai.js";

const BARGE_IN_WINDOW_MS = 1500;
const FRAME_DROP_MS = 20;

interface TwilioStartPayload {
  streamSid: string;
  callSid: string;
  from: string;
  to: string;
}

export class CallBridge {
  readonly session: CallSession;
  private readonly xai: XaiRealtimeClient;
  private outSequence = 0;
  private lastAssistantAudioAt = 0;
  private bargeCancelled = false;
  private teardownCalled = false;

  constructor(
    private readonly streamWs: WebSocket,
    start: TwilioStartPayload,
  ) {
    this.session = {
      sessionId: randomUUID(),
      callSid: start.callSid,
      streamSid: start.streamSid,
      callerNumber: normalizePhone(start.from),
      toNumber: start.to,
      isOwner: normalizePhone(start.from) === normalizePhone(config.ownerPhone),
      sudoVerified: false,
      verifyAttempts: 0,
      startedAt: Date.now(),
      userTranscript: "",
      assistantTranscript: "",
      dtmfBuffer: "",
    };
    this.xai = new XaiRealtimeClient(config.xaiApiKey, config.xaiAgentId);

    void createSession({
      sessionId: this.session.sessionId,
      callSid: this.session.callSid,
      callerNumber: this.session.callerNumber,
      isOwner: this.session.isOwner,
    });

    this.xai.open(this.session, {
      onAssistantAudioDelta: (base64) => this.handleAssistantAudio(base64),
      onAssistantTranscriptDelta: (delta) => {
        this.session.assistantTranscript += delta;
      },
      onAssistantTranscriptDone: (text) => {
        void saveMessage(this.session.sessionId, "assistant", text || this.session.assistantTranscript);
      },
      onUserTranscript: (text) => {
        this.session.userTranscript += (this.session.userTranscript ? " " : "") + text;
        void saveMessage(this.session.sessionId, "user", text);
      },
      onError: (error) => {
        console.error(`[bridge] ${this.session.callSid} x.ai:`, error);
      },
      onClose: () => {
        this.teardown("x.ai closed");
      },
    });
  }

  getCallSid(): string {
    return this.session.callSid;
  }

  handleStreamEvent(raw: WebSocket.RawData): void {
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(raw.toString()) as Record<string, unknown>;
    } catch {
      return;
    }
    if (msg.event === "media") {
      const media = msg.media as Record<string, unknown> | undefined;
      const payload = typeof media?.payload === "string" ? media.payload : "";
      const track = typeof media?.track === "string" ? media.track : "inbound";
      if (payload && track !== "dtmf") {
        this.handleInboundAudio(Buffer.from(payload, "base64"));
      }
    } else if (msg.event === "dtmf") {
      const dtmf = msg.dtmf as Record<string, unknown> | undefined;
      const digit = typeof dtmf?.digit === "string" ? dtmf.digit : "";
      if (digit) this.handleDtmf(digit);
    } else if (msg.event === "stop" || msg.event === "disconnected") {
      this.teardown("twilio stream ended");
    }
  }

  private handleInboundAudio(ulaw: Buffer): void {
    if (this.teardownCalled) return;
    const now = Date.now();
    if (!this.bargeCancelled && now - this.lastAssistantAudioAt < BARGE_IN_WINDOW_MS) {
      this.bargeCancelled = true;
      this.xai.cancelResponse();
    }
    const pcm = ulawSamplesToXaiBytes(ulaw);
    this.xai.appendInputBuffer(pcm);
  }

  private handleDtmf(digit: string): void {
    if (this.session.sudoVerified || this.teardownCalled || !/^\d$/.test(digit)) return;
    this.session.dtmfBuffer += digit;
    if (this.session.dtmfBuffer.length >= 4) {
      const code = this.session.dtmfBuffer.slice(0, 4);
      this.session.dtmfBuffer = "";
      this.xai.sendUserText(`My access code is ${code}.`);
    }
  }

  private handleAssistantAudio(base64: string): void {
    if (this.teardownCalled) return;
    this.lastAssistantAudioAt = Date.now();
    this.bargeCancelled = false;
    const pcm = Buffer.from(base64, "base64");
    const frames = xaiBytesToUlaw22ms(pcm);
    for (const frame of frames) {
      this.outSequence += FRAME_DROP_MS;
      this.sendToTwilio({
        event: "media",
        streamSid: this.session.streamSid,
        media: { payload: frame.toString("base64") },
      });
    }
  }

  private sendToTwilio(payload: Record<string, unknown>): void {
    if (this.streamWs.readyState === WebSocket.OPEN) {
      this.streamWs.send(JSON.stringify(payload));
    }
  }

  teardown(reason: string): void {
    if (this.teardownCalled) return;
    this.teardownCalled = true;
    console.log(`[bridge] teardown ${this.session.callSid}: ${reason}`);
    try {
      this.xai.close();
    } catch {
      /* noop */
    }
    const summary = [this.session.userTranscript, this.session.assistantTranscript].filter((t) => t.trim()).join(" | ").slice(0, 2000);
    void endSession(this.session.sessionId, summary || "(no conversation captured)");
    if (!memoryAvailable()) {
      console.warn("[bridge] supabase not configured; session was not persisted");
    }

    if (this.streamWs.readyState === WebSocket.OPEN) {
      try {
        this.streamWs.close();
      } catch {
        /* noop */
      }
    }
  }
}