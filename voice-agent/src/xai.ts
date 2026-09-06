import WebSocket from "ws";
import type { FunctionCall, ToolDefinition, XaiMessageHandlers, CallSession } from "./types.js";
import { TOOL_DEFINITIONS, dispatchTool } from "./tools.js";

const SYSTEM_PROMPT = (): string => `
You are the official voice agent for Don Matthews — founder of We The People News (wtpnews.org), Civil Rights Hub (civilrightshub.org), and donmatthews.live. You answer phone calls on his behalf.

PERSONA
- You speak in Don's voice: direct, plainspoken, principled, warm to ordinary people, and sharp about abuses of power. Keep responses conversational and short — this is a phone call, not an essay.
- You are an AI voice agent, not a human. If someone asks who you are, say you are Don Matthews' AI voice agent answering for his team. Never claim to be a human or that you are Don himself in a way that deceives anyone.

KNOWLEDGE
- Before answering questions about news, cases, court filings, or Don's reporting, call search_articles or latest_articles and base your answer on the article results. Cite the outlet, article title, and date briefly.
- If an article search returns nothing relevant, say you don't have that story yet and offer to fetch a page (fetch_page) from wtpnews.org, civilrightshub.org, or donmatthews.live.
- Never invent case numbers, filings, quotes, or rulings. If you do not know something, say so plainly.
- When asked about donations or support, call donation_info and share the details conversationally.

MEMORY
- Use remember to save durable facts about callers (name, preferences, plans, status updates) and recall to bring them back on later calls. Keep it useful and brief.

OWNER ACCESS (STRICT)
- If a caller identifies as Don Matthews, invite them to say their 4-digit access code, then call verify_access with exactly the digits stated. If the digits were unclear, ask them to repeat them.
- Never reveal that an access code exists to someone who does not already bring it up.
- Never confirm or deny whether a particular phone number belongs to Don.
- After verify_access succeeds, you may use admin_* tools when asked (repo status, reading files, opening issues, commenting, triggering deploys). Confirm actions to the owner before doing anything destructive, and report results plainly.
- If verify_access fails or admin tools report they are blocked, tell the caller owner features are not active for this call — no further explanation.

STYLE
- Answer directly, then stop. Avoid long lists; if several items matter, give the top one or two and offer more.
- You can express honest outrage with measured words when discussing documented abuses, but never embellish facts.
`.trim();

export const xaiWsUrl = (agentId: string): string => `wss://api.x.ai/v1/realtime?agent_id=${encodeURIComponent(agentId)}`;

export class XaiRealtimeClient {
  private ws: WebSocket | null = null;
  private readonly handledCalls = new Set<string>();
  private greeted = false;

  constructor(
    private readonly apiKey: string,
    private readonly agentId: string,
  ) {}

  open(session: CallSession, handlers: XaiMessageHandlers): void {
    const ws = new WebSocket(xaiWsUrl(this.agentId), {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      handshakeTimeout: 15000,
    });
    this.ws = ws;

    ws.on("open", () => {
      this.sendSessionUpdate();
    });

    ws.on("message", (raw) => {
      let event: Record<string, unknown>;
      try {
        event = JSON.parse(raw.toString()) as Record<string, unknown>;
      } catch {
        return;
      }
      this.handleEvent(event, session, handlers).catch((error) => {
        handlers.onError(String(error));
      });
    });

    ws.on("error", (error) => {
      handlers.onError(`x.ai connection error: ${error.message}`);
    });

    ws.on("close", () => {
      handlers.onClose();
    });
  }

  private send(payload: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  private sendSessionUpdate(): void {
    this.send({
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: SYSTEM_PROMPT(),
        tools: TOOL_DEFINITIONS.map((t: ToolDefinition) => ({
          type: "function",
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        })),
        turn_detection: {
          type: "server_vad",
          threshold: 0.6,
          prefix_padding_ms: 300,
          silence_duration_ms: 600,
        },
        input_audio_transcription: { model: "whisper-1" },
      },
    });
  }

  private async handleEvent(
    event: Record<string, unknown>,
    session: CallSession,
    handlers: XaiMessageHandlers,
  ): Promise<void> {
    switch (event.type) {
      case "session.created":
      case "session.updated": {
        if (!this.greeted) {
          this.greeted = true;
          this.send({ type: "response.create" });
        }
        return;
      }
      case "response.output_audio.delta": {
        const delta = event.delta;
        if (typeof delta === "string") handlers.onAssistantAudioDelta(delta);
        return;
      }
      case "response.output_audio_transcript.delta":
      case "response.audio_transcript.delta": {
        const delta = event.delta;
        if (typeof delta === "string") handlers.onAssistantTranscriptDelta(delta);
        return;
      }
      case "response.audio_transcript.done":
      case "response.output_audio_transcript.done": {
        const text = event.transcript ?? event.text;
        if (typeof text === "string") handlers.onAssistantTranscriptDone(text);
        return;
      }
      case "conversation.item.input_audio_transcription.completed": {
        const text = event.transcript;
        if (typeof text === "string" && text.trim() !== "") handlers.onUserTranscript(text);
        return;
      }
      case "conversation.item.input_audio_transcription.failed": {
        handlers.onError("Input transcription failed.");
        return;
      }
      case "response.function_call_arguments.done": {
        const callId = typeof event.call_id === "string" ? event.call_id : "";
        const name = typeof event.name === "string" ? event.name : "";
        const args = typeof event.arguments === "string" ? event.arguments : "{}";
        if (callId && name && !this.handledCalls.has(callId)) {
          this.handledCalls.add(callId);
          await this.executeFunctionCall({ callId, name, arguments: args }, session);
        }
        return;
      }
      case "response.done":
      case "response.output_item.done": {
        return;
      }
      case "error": {
        const err = event.error as Record<string, unknown> | undefined;
        handlers.onError(`x.ai error: ${String((err as { message?: string })?.message ?? JSON.stringify(event).slice(0, 300))}`);
        return;
      }
      default:
        return;
    }
  }

  private async executeFunctionCall(call: FunctionCall, session: CallSession): Promise<void> {
    let parsedArgs: Record<string, unknown>;
    try {
      parsedArgs = JSON.parse(call.arguments || "{}") as Record<string, unknown>;
    } catch {
      parsedArgs = {};
    }
    const output = await dispatchTool(session, call.name, parsedArgs);
    this.send({
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: call.callId,
        output,
      },
    });
    this.send({ type: "response.create" });
  }

  appendInputBuffer(pcmBytes: Buffer): void {
    this.send({
      type: "input_audio_buffer.append",
      audio: pcmBytes.toString("base64"),
    });
  }

  cancelResponse(): void {
    this.send({ type: "response.cancel" });
  }

  sendUserText(text: string): void {
    this.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text }],
      },
    });
    this.send({ type: "response.create" });
  }

  close(): void {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        /* noop */
      }
      this.ws = null;
    }
  }
}