import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "./config.js";

let db: SupabaseClient | null = null;

export function getDb(): SupabaseClient | null {
  if (db) return db;
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    return null;
  }
  db = createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false },
  });
  return db;
}

export const memoryAvailable = (): boolean => getDb() !== null;

export async function createSession(row: {
  sessionId: string;
  callSid: string;
  callerNumber: string;
  isOwner: boolean;
}): Promise<void> {
  const client = getDb();
  if (!client) return;
  await client.from("voice_sessions").insert({
    session_id: row.sessionId,
    call_sid: row.callSid,
    caller_number: row.callerNumber,
    is_owner: row.isOwner,
  });
}

export async function endSession(sessionId: string, summary: string): Promise<void> {
  const client = getDb();
  if (!client) return;
  await client
    .from("voice_sessions")
    .update({ ended_at: new Date().toISOString(), summary: summary.slice(0, 2000) })
    .eq("session_id", sessionId);
}

export async function saveMessage(sessionId: string, role: "user" | "assistant" | "tool", content: string): Promise<void> {
  const client = getDb();
  if (!client || content.trim() === "") return;
  await client.from("voice_messages").insert({
    session_id: sessionId,
    role,
    content: content.slice(0, 8000),
  });
}

export async function setVerified(sessionId: string, value: boolean): Promise<void> {
  const client = getDb();
  if (!client) return;
  await client.from("voice_sessions").update({ sudo_verified: value }).eq("session_id", sessionId);
}

export async function incrementVerifyAttempts(sessionId: string): Promise<void> {
  const client = getDb();
  if (!client) return;
  const { data } = await client
    .from("voice_sessions")
    .select("verify_attempts")
    .eq("session_id", sessionId)
    .maybeSingle<{ verify_attempts: number }>();
  const next = (data?.verify_attempts ?? 0) + 1;
  await client.from("voice_sessions").update({ verify_attempts: next }).eq("session_id", sessionId);
}

export async function setDonationInfo(text: string): Promise<void> {
  const client = getDb();
  if (!client) return;
  await client.from("voice_memory").upsert(
    { label: "donation_info", detail: text },
    { onConflict: "label" },
  );
}

export async function getDonationInfo(): Promise<string | null> {
  const client = getDb();
  if (!client) return null;
  const { data } = await client
    .from("voice_memory")
    .select("detail")
    .eq("label", "donation_info")
    .maybeSingle<{ detail: string }>();
  return data?.detail ?? null;
}

export async function rememberFact(label: string, detail: string): Promise<void> {
  const client = getDb();
  if (!client) return;
  await client.from("voice_memory").upsert({ label, detail }, { onConflict: "label" });
}

export async function recallFacts(topic: string, limit = 10): Promise<string[]> {
  const client = getDb();
  if (!client) return [];
  const pattern = `%${topic}%`;
  const { data } = await client
    .from("voice_memory")
    .select("label, detail")
    .or(`label.ilike.${pattern},detail.ilike.${pattern}`)
    .limit(limit);
  return (data ?? []).map((row) => `${row.label}: ${row.detail}`);
}

export async function recallLastSession(callerNumber: string, limit = 12): Promise<string[]> {
  const client = getDb();
  if (!client) return [];
  const { data: sessions } = await client
    .from("voice_sessions")
    .select("session_id")
    .eq("caller_number", callerNumber)
    .not("ended_at", "is", null)
    .order("ended_at", { ascending: false })
    .limit(1);
  const last = sessions?.[0]?.session_id;
  if (!last) return [];
  const { data: messages } = await client
    .from("voice_messages")
    .select("role, content")
    .eq("session_id", last)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (messages ?? []).reverse().map((m) => `${m.role}: ${m.content.slice(0, 500)}`);
}

export async function logAudit(entry: {
  sessionId: string;
  callerNumber: string;
  tool: string;
  args: string;
  ok: boolean;
  result: string;
}): Promise<void> {
  const client = getDb();
  if (!client) return;
  await client.from("admin_audit_log").insert({
    session_id: entry.sessionId,
    caller_number: entry.callerNumber,
    tool: entry.tool,
    args: entry.args.slice(0, 2000),
    ok: entry.ok,
    result: entry.result.slice(0, 4000),
  });
}

export async function upsertArticles(
  rows: Array<{ source: string; url: string; title: string; summary: string; publishedAt: string | null }>,
): Promise<{ inserted: number; failed: number }> {
  const client = getDb();
  if (!client) return { inserted: 0, failed: rows.length };
  let inserted = 0;
  let failed = 0;
  for (const row of rows) {
    const { error } = await client.from("voice_articles").upsert(
      {
        source: row.source,
        url: row.url,
        title: row.title.slice(0, 500),
        summary: row.summary.slice(0, 8000),
        published_at: row.publishedAt,
      },
      { onConflict: "url", ignoreDuplicates: true },
    );
    if (error) failed++;
    else inserted++;
  }
  return { inserted, failed };
}

export async function searchArticles(query: string, limit = 5): Promise<string[]> {
  const client = getDb();
  if (!client) return [];
  const pattern = `%${query}%`;
  const { data } = await client
    .from("voice_articles")
    .select("source, url, title, summary, published_at")
    .or(`title.ilike.${pattern},summary.ilike.${pattern}`)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => {
    const date = row.published_at ? new Date(row.published_at).toISOString().slice(0, 10) : "unknown date";
    return `${row.title} (${row.source}, ${date}) — ${row.summary.slice(0, 600)} — ${row.url}`;
  });
}

export async function latestArticles(days: number | null, limit = 8): Promise<string[]> {
  const client = getDb();
  if (!client) return [];
  const since = new Date();
  since.setDate(since.getDate() - (days && days > 0 ? days : 30));
  const { data } = await client
    .from("voice_articles")
    .select("source, url, title, summary, published_at")
    .gte("published_at", since.toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => {
    const date = row.published_at ? new Date(row.published_at).toISOString().slice(0, 10) : "unknown date";
    return `${row.title} (${row.source}, ${date}) — ${row.summary.slice(0, 500)} — ${row.url}`;
  });
}