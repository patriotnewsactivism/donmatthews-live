import { fetchFeedAll } from "./content.js";
import { upsertArticles, memoryAvailable } from "./memory.js";

async function main(): Promise<void> {
  console.log("[ingest] fetching feeds...");
  const { rows, errors } = await fetchFeedAll();
  for (const error of errors) {
    console.warn("[ingest] source error:", error);
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