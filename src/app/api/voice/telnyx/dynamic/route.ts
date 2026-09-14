import { initializeManagedCall, validManagedWebhookToken } from "../../../../../../voice-agent/src/telnyx-managed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  if (!validManagedWebhookToken(token)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const dynamicVariables = await initializeManagedCall(payload);
  return Response.json(
    { dynamic_variables: dynamicVariables },
    { headers: { "cache-control": "no-store" } },
  );
}
