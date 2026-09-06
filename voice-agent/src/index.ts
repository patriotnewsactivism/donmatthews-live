import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { WebSocketServer, type WebSocket, type RawData } from "ws";
import { config } from "./config.js";
import { CallBridge } from "./bridge.js";
import { memoryAvailable } from "./memory.js";

const bridges = new Map<string, CallBridge>();

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function handleVoiceWebhook(_req: IncomingMessage, res: ServerResponse): void {
  const streamUrl = `${config.publicBaseUrl.replace(/^http:/, "ws:")}/stream`;
  const tokenSuffix = config.streamToken ? `?token=${encodeURIComponent(config.streamToken)}` : "";
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}${tokenSuffix}"></Stream>
  </Connect>
</Response>`;
  res.writeHead(200, { "Content-Type": "text/xml; charset=utf-8" });
  res.end(twiml);
}

function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  writeJson(res, 200, {
    ok: true,
    service: "don-voice-agent",
    memory: memoryAvailable() ? "supabase" : "disabled",
    admin: config.githubToken ? "configured" : "disabled",
  });
}

const server = createServer((req, res) => {
  const path = (req.url ?? "").split("?")[0];
  try {
    if (req.method === "GET" && path === "/health") return handleHealth(req, res);
    if (req.method === "POST" && path === "/twilio/voice") return handleVoiceWebhook(req, res);
    writeJson(res, 404, { error: "not found" });
  } catch (error) {
    console.error("[http] handler failed:", error);
    writeJson(res, 500, { error: "internal error" });
  }
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
    if (msg.event === "start") {
      const start = msg.start as Record<string, unknown> | undefined;
      if (!start) return;
      const callSid = String(start.callSid ?? "");
      const streamSid = String(start.streamSid ?? "");
      const from = String(start.from ?? "");
      const to = String(start.to ?? "");
      if (!callSid || !streamSid) return;
      clearTimeout(timer);
      console.log(`[stream] call ${callSid} from ${from} to ${to}`);
      bridge = new CallBridge(ws, { streamSid, callSid, from, to });
      bridges.set(callSid, bridge);
      ws.on("close", () => {
        bridges.delete(callSid);
      });
    }
  });

  ws.on("close", () => {
    if (bridge) bridge.teardown("twilio stream closed");
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
  console.log(`[index] twilio webhook -> ${config.publicBaseUrl}/twilio/voice`);
  console.log(`[index] media stream  -> ${config.publicBaseUrl.replace(/^http:/, "ws:")}/stream`);
  console.log(`[index] memory: ${memoryAvailable() ? "supabase" : "DISABLED"} | admin: ${config.githubToken ? "configured" : "DISABLED"}`);
});

function shutdown(reason: string): void {
  console.log(`[index] shutting down (${reason})`);
  for (const bridge of bridges.values()) {
    bridge.teardown("server shutdown");
  }
  wss.close(() => {
    server.close(() => process.exit(0));
  });
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));