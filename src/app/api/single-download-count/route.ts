import { NextResponse } from "next/server";

// Read-only "X of 100 claimed" counter for the single-download promo section.
// No email/claim side effects — just reports current remaining count.

const CAP = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackSlug = searchParams.get("track") || "happy-fuck-the-cops-day";

  const supabaseUrl = process.env.SINGLES_SUPABASE_URL;
  const supabaseKey = process.env.SINGLES_SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_single_download_remaining`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_track_slug: trackSlug, p_cap: CAP }),
      signal: AbortSignal.timeout(8000),
    });
    if (!rpcRes.ok) {
      console.error("[single-download-count] RPC error:", await rpcRes.text());
      return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
    }
    const result = await rpcRes.json();
    return NextResponse.json({ remaining: result.remaining, cap: CAP });
  } catch (error) {
    console.error("Error in single-download-count route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
