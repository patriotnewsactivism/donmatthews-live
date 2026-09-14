import { fetchFeedAll, fetchPageText } from "./content.js";
import { upsertArticles, memoryAvailable } from "./memory.js";

async function main(): Promise<void> {
  console.log("[ingest] fetching feeds...");
  const { rows, errors } = await fetchFeedAll();
  for (const error of errors) {
    console.warn("[ingest] source error:", error);
  }
  if (!rows.some((row) => /civil rights hub/i.test(row.source))) {
    try {
      const summary = await fetchPageText("https://civilrightshub.org");
      rows.push({
        source: "Civil Rights Hub",
        url: "https://civilrightshub.org",
        title: "Civil Rights Hub",
        summary,
        publishedAt: new Date().toISOString(),
      });
      console.log("[ingest] added Civil Rights Hub homepage snapshot (no RSS feed)");
    } catch (error) {
      console.warn("[ingest] Civil Rights Hub homepage snapshot failed:", error);
    }
  }
  console.log(`[ingest] ${rows.length} items fetched (${errors.length} source errors)`);

  if (!memoryAvailable()) {
    console.error("[ingest] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing — nothing persisted");
    process.exit(1);
  }

  const { inserted, failed } = await upsertArticles(rows);
  console.log(`[ingest] persisted: ${inserted} new (${failed} failures)`);

  if (rows.length > 0 && process.env.INGEST_GREETING === "1") {
    console.log("[ingest] done");
  }
  process.exit(errors.length === rows.length ? 1 : 0);
}

main().catch((error) => {
  console.error("[ingest] failed:", error);
  process.exit(1);
});