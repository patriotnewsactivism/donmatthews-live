import { executeManagedTool, validManagedWebhookToken } from "../../../../../../../voice-agent/src/telnyx-managed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: { name: string } },
): Promise<Response> {
  const token = request.headers.get("x-don-voice-tool-token") ?? "";
  if (!validManagedWebhookToken(token)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const callControlId = request.headers.get("x-telnyx-call-control-id") ?? "";
  if (!callControlId) {
    return Response.json({ error: "missing call control id" }, { status: 400 });
  }

  let args: Record<string, unknown> = {};
  try {
    args = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  try {
    const result = await executeManagedTool(decodeURIComponent(params.name), callControlId, args);
    return Response.json({ result }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[telnyx-tool] failed:", error);
    return Response.json(
      { error: "tool failed", detail: String(error).slice(0, 500) },
      { status: 500 },
    );
  }
}
