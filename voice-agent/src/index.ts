import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { WebSocketServer, type WebSocket, type RawData } from "ws";
import { config } from "./config.js";
import { CallBridge } from "./bridge.js";
import { memoryAvailable } from "./memory.js";
import { parseStreamStart, parseVoiceWebhook, readRequestBody, streamUrl, toWsUrl, voiceTeXml } from "./telephony.js";
import { handleSipWebhook, teardownSipSessions } from "./sip.js";

const bridges = new Map<string, CallBridge>();

const VOICE_PATHS = new Set(["/voice", "/telnyx/voice", "/twilio/voice"]);

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function handleVoiceWebhook(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = req.method === "POST" ? await readRequestBody(req) : "";
  const contentType = String(req.headers["content-type"] ?? "");
  const caller = parseVoiceWebhook(body, contentType);
  const xml = voiceTeXml(streamUrl(config.publicBaseUrl, config.streamToken), caller.from, caller.to);
  res.writeHead(200, { "Content-Type": "text/xml; charset=utf-8" });
  res.end(xml);
}

function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  writeJson(res, 200, {
    ok: true,
    service: "don-voice-agent",
    memory: memoryAvailable() ? "supabase" : "disabled",
    admin: config.githubToken ? "configured" : "disabled",
    agent: Boolean(config.xaiAgentId),
    xai: config.xaiApiKey ? "configured" : "missing",
  });
}

const server = createServer((req, res) => {
  const path = (req.url ?? "").split("?")[0];
  void (async () => {
    try {
      if (req.method === "GET" && path === "/health") return handleHealth(req, res);
      if ((req.method === "POST" || req.method === "GET") && VOICE_PATHS.has(path)) {
        return await handleVoiceWebhook(req, res);
      }
      if (req.method === "POST" && path === "/xai/sip") {
        return await handleSipWebhook(req, res);
      }
      writeJson(res, 404, { error: "not found" });
    } catch (error) {
      console.error("[http] handler failed:", error);
      writeJson(res, 500, { error: "internal error" });
    }
  })();
});

function isTokenValid(req: IncomingMessage): boolean {
  if (!config.streamToken) return true;
  const url = new URL(req.url ?? "", "http://localhost");
  const token = url.searchParams.get("token");
  return token === config.streamToken;
}

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws: WebSocket, _req: IncomingMessage) => {
  let bridge: CallBridge | null = null;
  const timer = setTimeout(() => {
    console.warn("[stream] no start event within 15s, closing");
    try {
      ws.close();
    } catch {
      /* noop */
    }
  }, 15000);

  ws.on("message", (raw: RawData, _isBinary: boolean) => {
    if (bridge) {
      bridge.handleStreamEvent(raw);
      return;
    }
    let msg: Record<string, unknown>;
    try {
      msg = JSON.parse(raw.toString()) as Record<string, unknown>;
    } catch {
      return;
    }
    if (msg.event === "connected") return;
    const start = parseStreamStart(msg);
    if (start) {
      clearTimeout(timer);
      console.log(`[stream] call ${start.callSid} from ${start.from} to ${start.to}`);
      bridge = new CallBridge(ws, start);
      bridges.set(start.callSid, bridge);
      ws.on("close", () => {
        bridges.delete(start.callSid);
      });
    }
  });

  ws.on("close", () => {
    if (bridge) bridge.teardown("phone stream closed");
  });
});

server.on("upgrade", (req, socket, head) => {
  const path = (req.url ?? "").split("?")[0];
  if (path !== "/stream" || !isTokenValid(req)) {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

server.listen(config.port, () => {
  console.log(`[index] don-voice-agent listening on :${config.port}`);
  console.log(`[index] voice webhook -> ${config.publicBaseUrl}/voice`);
  console.log(`[index] sip webhook   -> ${config.publicBaseUrl}/xai/sip`);
  console.log(`[index] media stream  -> ${toWsUrl(config.publicBaseUrl)}/stream`);
  console.log(`[index] memory: ${memoryAvailable() ? "supabase" : "DISABLED"} | admin: ${config.githubToken ? "configured" : "DISABLED"}`);
});

function shutdown(reason: string): void {
  console.log(`[index] shutting down (${reason})`);
  for (const bridge of bridges.values()) {
    bridge.teardown("server shutdown");
  }
  teardownSipSessions();
  wss.close(() => {
    server.close(() => process.exit(0));
  });
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));