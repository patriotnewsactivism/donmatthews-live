import { timingSafeEqualStr } from "../../../../../../voice-agent/src/audio";
import { config } from "../../../../../../voice-agent/src/config";
import { placeManagedOutboundCall } from "../../../../../../voice-agent/src/telnyx-managed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorized(request: Request): boolean {
  if (!config.adminPasscode) return false;
  const authorization = request.headers.get("authorization") ?? "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  return Boolean(supplied && timingSafeEqualStr(supplied, config.adminPasscode));
}

export async function POST(request: Request): Promise<Response> {
  if (!authorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { to?: string } = {};
  try {
    body = (await request.json()) as { to?: string };
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  try {
    const result = await placeManagedOutboundCall(String(body.to ?? "").trim());
    return Response.json({ ok: true, result }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[telnyx-call] failed:", error);
    return Response.json(
      { error: "call failed", detail: String(error).slice(0, 1000) },
      { status: 502 },
    );
  }
}
