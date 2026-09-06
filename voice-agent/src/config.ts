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

export const config = {
  port: Number(optEnv("PORT", "8080")),
  xaiApiKey: requireEnv("XAI_API_KEY"),
  xaiAgentId: requireEnv("XAI_AGENT_ID"),
  publicBaseUrl: optEnv("PUBLIC_BASE_URL", "http://localhost:8080").replace(/\/+$/, ""),
  streamToken: optEnv("STREAM_TOKEN"),
  supabaseUrl: optEnv("SUPABASE_URL"),
  supabaseServiceKey: optEnv("SUPABASE_SERVICE_ROLE_KEY"),
  ownerPhone: optEnv("OWNER_PHONE", "+18328804970"),
  adminPasscode: optEnv("ADMIN_PASSCODE", "2269"),
  maxVerifyAttempts: Number(optEnv("MAX_VERIFY_ATTEMPTS", "3")),
  githubToken: optEnv("GITHUB_TOKEN"),
  githubUser: optEnv("GITHUB_USER"),
  donationInfoText: optEnv(
    "DONATION_INFO_TEXT",
    "Support the independent journalism and civil rights work at donmatthews.live. Visit wtpnews.org or civilrightshub.org for the current support options, or use the contact page on donmatthews.live to reach Don directly.",
  ),
} as const;

export const hasTelephony = (): boolean => config.streamToken === "" || config.publicBaseUrl.startsWith("https://");