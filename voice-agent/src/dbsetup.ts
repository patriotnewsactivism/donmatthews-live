import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { config } from "./config.js";
import { memoryAvailable, setDonationInfo } from "./memory.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function main(): Promise<void> {
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required to apply schema.sql");
  }
  const dbUrl = config.databaseUrl.replace(":6543/", ":5432/");
  const sql = postgres(dbUrl, { max: 1, ssl: "require" });
  const schema = readFileSync(join(root, "schema.sql"), "utf8");
  try {
    await sql.unsafe(schema);
    console.log("[dbsetup] schema applied");
  } finally {
    await sql.end({ timeout: 5 });
  }

  if (!memoryAvailable()) {
    console.warn("[dbsetup] supabase client not configured; skipped donation seed");
    return;
  }
  await setDonationInfo(config.donationInfoText);
  console.log("[dbsetup] donation_info memory seeded");
}

main().catch((error) => {
  console.error("[dbsetup] failed:", error);
  process.exit(1);
});
