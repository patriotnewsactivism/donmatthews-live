import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optEnv(name: string, fallback = ""): string {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : fallback;
}

const DEFAULT_DONATION_INFO =
  "Support independent journalism and civil-rights work at donmatthews.live/support. " +
  "GoFundMe: https://www.gofundme.com/f/a-journalist-fights-for-justice. " +
  "PayPal: https://paypal.biz/wtpnews. " +
  "Cash App: https://cash.app/$1Aaudit. " +
  "The American Injustice eBook is free with a donation of any amount.";

export const config = {
  port: Number(optEnv("PORT", "8080")),
  xaiApiKey: optEnv("XAI_API_KEY"),
  xaiAgentId: optEnv("XAI_AGENT_ID", "agent_BVrCNfKW2CpeZyH2"),
  publicBaseUrl: optEnv("PUBLIC_BASE_URL", "http://localhost:8080").replace(/\/+$/, ""),
  streamToken: optEnv("STREAM_TOKEN"),
  supabaseUrl: optEnv("SUPABASE_URL"),
  supabaseServiceKey: optEnv("SUPABASE_SERVICE_ROLE_KEY"),
  databaseUrl: optEnv("DATABASE_URL"),
  ownerPhone: optEnv("OWNER_PHONE", "+18328804970"),
  adminPasscode: requireEnv("ADMIN_PASSCODE"),
  maxVerifyAttempts: Number(optEnv("MAX_VERIFY_ATTEMPTS", "3")),
  githubToken: optEnv("GITHUB_TOKEN"),
  githubUser: optEnv("GITHUB_USER", "patriotnewsactivism"),
  donationInfoText: optEnv("DONATION_INFO_TEXT", DEFAULT_DONATION_INFO),
} as const;