import { experimental_upgradeWebSocket, type WebSocketData } from "@vercel/functions";
import WebSocket, { type RawData } from "ws";
import { CallBridge } from "../../../voice-agent/src/bridge";
import { config } from "../../../voice-agent/src/config";
import { parseStreamStart } from "../../../voice-agent/src/telephony";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const bridges = new Map<string, CallBridge>();

function tokenValid(request: Request): boolean {
  if (!config.streamToken) return true;
  return new URL(request.url).searchParams.get("token") === config.streamToken;
}

export async function GET(request: Request): Promise<Response> {
  if (!tokenValid(request)) {
    return Response.json({ error: "unauthorized stream" }, { status: 401 });
  }

  return experimental_upgradeWebSocket((socket) => {
    const ws = socket as unknown as WebSocket;
    let bridge: CallBridge | null = null;

    const timer = setTimeout(() => {
      console.warn("[stream] no start event within 15s, closing");
      try {
        ws.close();
      } catch {
        // noop
      }
    }, 15_000);

    socket.on("message", (data: WebSocketData) => {
      const raw = data as unknown as RawData;
      if (bridge) {
        bridge.handleStreamEvent(raw);
        return;
      }

      let message: Record<string, unknown>;
      try {
        message = JSON.parse(raw.toString()) as Record<string, unknown>;
      } catch {
        return;
      }

      if (message.event === "connected") return;
      const start = parseStreamStart(message);
      if (!start) return;

      clearTimeout(timer);
      console.log(`[stream] call ${start.callSid} from ${start.from} to ${start.to}`);
      bridge = new CallBridge(ws, start);
      bridges.set(start.callSid, bridge);
    });

    socket.on("close", () => {
      clearTimeout(timer);
      if (bridge) {
        const callSid = bridge.getCallSid();
        bridge.teardown("phone stream closed");
        bridges.delete(callSid);
      }
    });

    socket.on("error", (error) => {
      console.error("[stream] websocket error:", error);
      if (bridge) bridge.teardown("phone stream error");
    });
  });
}
