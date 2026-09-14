import type { IncomingMessage } from "node:http";
import { config } from "./config.js";

export interface CallIdentifiers {
  streamSid: string;
  callSid: string;
  from: string;
  to: string;
}

export function toWsUrl(httpUrl: string): string {
  return httpUrl.replace(/^https:/i, "wss:").replace(/^http:/i, "ws:");
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function streamUrl(): string {
  const tokenSuffix = config.streamToken ? `?token=${encodeURIComponent(config.streamToken)}` : "";
  return `${toWsUrl(config.publicBaseUrl)}/stream${tokenSuffix}`;
}

export function voiceTeXml(from = "", to = ""): string {
  const url = xmlEscape(streamUrl());
  const fromParam = from
    ? `\n      <Parameter name="from" value="${xmlEscape(from)}" />`
    : "";
  const toParam = to ? `\n      <Parameter name="to" value="${xmlEscape(to)}" />` : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${url}" track="inbound_track" codec="PCMU" bidirectionalMode="rtp" bidirectionalCodec="PCMU" bidirectionalSamplingRate="8000">${fromParam}${toParam}
    </Stream>
  </Connect>
</Response>`;
}

export function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
      if (chunks.reduce((n, c) => n + c.length, 0) > 1_000_000) {
        reject(new Error("request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function firstString(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return "";
}

function parseForm(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const params = new URLSearchParams(body);
  for (const [key, value] of params.entries()) {
    out[key] = value;
  }
  return out;
}

function pickCaller(source: Record<string, unknown>): { from: string; to: string; callSid: string } {
  const payload =
    source.data && typeof source.data === "object"
      ? ((source.data as Record<string, unknown>).payload as Record<string, unknown> | undefined)
      : undefined;
  const from =
    firstString(source.From) ||
    firstString(source.from) ||
    firstString(source.Caller) ||
    firstString(payload?.from);
  const to =
    firstString(source.To) ||
    firstString(source.to) ||
    firstString(source.Called) ||
    firstString(payload?.to);
  const callSid =
    firstString(source.CallSid) ||
    firstString(source.call_sid) ||
    firstString(source.CallControlId) ||
    firstString(source.call_control_id) ||
    firstString(payload?.call_control_id) ||
    firstString(payload?.call_session_id);
  return { from, to, callSid };
}

export function parseVoiceWebhook(body: string, contentType: string): { from: string; to: string; callSid: string } {
  const type = contentType.toLowerCase();
  if (type.includes("application/json")) {
    try {
      return pickCaller(JSON.parse(body) as Record<string, unknown>);
    } catch {
      return { from: "", to: "", callSid: "" };
    }
  }
  return pickCaller(parseForm(body));
}

function customParams(start: Record<string, unknown>): Record<string, unknown> {
  const raw = start.customParameters ?? start.custom_parameters ?? start.custom_parameter;
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
}

export function parseStreamStart(msg: Record<string, unknown>): CallIdentifiers | null {
  if (msg.event !== "start") return null;
  const start = (msg.start as Record<string, unknown> | undefined) ?? {};
  const params = customParams(start);
  const streamSid =
    firstString(start.streamSid) ||
    firstString(msg.streamSid) ||
    firstString(msg.stream_id) ||
    firstString(start.stream_id);
  const callSid =
    firstString(start.callSid) ||
    firstString(start.call_control_id) ||
    firstString(start.call_session_id) ||
    firstString(msg.call_control_id);
  const from =
    firstString(start.from) ||
    firstString(params.from) ||
    firstString(params.From);
  const to =
    firstString(start.to) ||
    firstString(params.to) ||
    firstString(params.To);
  if (!streamSid || !callSid) return null;
  return { streamSid, callSid, from, to };
}

export function dtmfDigit(msg: Record<string, unknown>): string {
  const dtmf = msg.dtmf;
  if (typeof dtmf === "string") return dtmf;
  if (dtmf && typeof dtmf === "object") {
    const rec = dtmf as Record<string, unknown>;
    return firstString(rec.digit) || firstString(rec.dtmf);
  }
  return firstString(msg.digit);
}
