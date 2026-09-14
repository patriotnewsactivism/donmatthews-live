import { randomUUID } from "node:crypto";
import WebSocket from "ws";
import type { CallSession } from "./types.js";
import { config } from "./config.js";
import { normalizePhone, ulawSamplesToXaiBytes, xaiBytesToUlaw22ms } from "./audio.js";
import { createSession, endSession, saveMessage, memoryAvailable } from "./memory.js";
import { XaiRealtimeClient } from "./xai.js";
import { dtmfDigit, type CallIdentifiers } from "./telephony.js";

const FRAME_DROP_MS = 20;
const XAI_BYTES_PER_20MS_FRAME = 24000 / 50 * 2;

export class CallBridge {
  readonly session: CallSession;
  private readonly xai: XaiRealtimeClient;
  private outSequence = 0;
  private teardownCalled = false;
  private assistantPcmRemainder = Buffer.alloc(0);
  private phoneAudioQueue: Buffer[] = [];
  private phoneAudioTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly streamWs: WebSocket,
    start: CallIdentifiers,
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
    if (!config.xaiApiKey) {
      throw new Error("XAI_API_KEY is required to answer calls");
    }
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
      const digit = dtmfDigit(msg);
      if (digit) this.handleDtmf(digit);
    } else if (msg.event === "stop" || msg.event === "disconnected") {
      this.teardown("phone stream ended");
    }
  }

  private handleInboundAudio(ulaw: Buffer): void {
    if (this.teardownCalled) return;
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
    const pcm = Buffer.concat([this.assistantPcmRemainder, Buffer.from(base64, "base64")]);
    const usableBytes = Math.floor(pcm.length / XAI_BYTES_PER_20MS_FRAME) * XAI_BYTES_PER_20MS_FRAME;
    if (usableBytes <= 0) {
      this.assistantPcmRemainder = pcm;
      return;
    }

    const framedPcm = pcm.subarray(0, usableBytes);
    this.assistantPcmRemainder = pcm.subarray(usableBytes);
    this.phoneAudioQueue.push(...xaiBytesToUlaw22ms(framedPcm));
    this.pumpPhoneAudio();
  }

  private pumpPhoneAudio(): void {
    if (this.phoneAudioTimer || this.teardownCalled) return;
    this.phoneAudioTimer = setInterval(() => {
      if (this.teardownCalled) {
        this.stopPhoneAudioPump();
        return;
      }

      const frame = this.phoneAudioQueue.shift();
      if (!frame) {
        this.stopPhoneAudioPump();
        return;
      }

      this.outSequence += FRAME_DROP_MS;
      this.sendToPhone({
        event: "media",
        streamSid: this.session.streamSid,
        stream_id: this.session.streamSid,
        media: {
          payload: frame.toString("base64"),
        },
      });
    }, FRAME_DROP_MS);
  }

  private stopPhoneAudioPump(): void {
    if (this.phoneAudioTimer) {
      clearInterval(this.phoneAudioTimer);
      this.phoneAudioTimer = null;
    }
  }

  private sendToPhone(payload: Record<string, unknown>): void {
    if (this.streamWs.readyState === WebSocket.OPEN) {
      this.streamWs.send(JSON.stringify(payload));
    }
  }

  teardown(reason: string): void {
    if (this.teardownCalled) return;
    this.teardownCalled = true;
    console.log(`[bridge] teardown ${this.session.callSid}: ${reason}`);
    this.stopPhoneAudioPump();
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
