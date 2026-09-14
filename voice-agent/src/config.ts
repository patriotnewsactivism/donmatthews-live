import "dotenv/config";

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

  // Telnyx managed Conversational AI (primary path).
  telnyxApiKey: optEnv("TELNYX_API_KEY"),
  telnyxAssistantId: optEnv("TELNYX_ASSISTANT_ID"),
  telnyxModel: optEnv("TELNYX_AI_MODEL", "moonshotai/Kimi-K2.5"),
  telnyxVoice: optEnv("TELNYX_AI_VOICE", "Telnyx.NaturalHD.andersen_johan"),
  telnyxTranscriptionModel: optEnv("TELNYX_STT_MODEL", "deepgram/flux"),
  telnyxToolToken: optEnv("TELNYX_TOOL_TOKEN"),
  telnyxTexmlAppId: optEnv("TELNYX_TEXML_APP_ID"),
  telnyxCallerId: optEnv("TELNYX_CALLER_ID"),

  // Legacy xAI/WebSocket path. Kept as an explicit rollback path while the
  // managed Telnyx assistant is proven in production.
  xaiApiKey: optEnv("XAI_API_KEY"),
  xaiAgentId: optEnv("XAI_AGENT_ID", "agent_BVrCNfKW2CpeZyH2"),
  publicBaseUrl: optEnv("PUBLIC_BASE_URL", "http://localhost:8080").replace(/\/+$/, ""),
  streamToken: optEnv("STREAM_TOKEN"),

  supabaseUrl: optEnv("SUPABASE_URL"),
  supabaseServiceKey: optEnv("SUPABASE_SERVICE_ROLE_KEY"),
  databaseUrl: optEnv("DATABASE_URL"),
  ownerPhone: optEnv("OWNER_PHONE", "+18328804970"),
  // Fail closed when unset: verify_access can never succeed with an empty passcode.
  // This lets Vercel preview/builds come up before production secrets are copied over.
  adminPasscode: optEnv("ADMIN_PASSCODE"),
  maxVerifyAttempts: Number(optEnv("MAX_VERIFY_ATTEMPTS", "3")),
  githubToken: optEnv("GITHUB_TOKEN"),
  githubUser: optEnv("GITHUB_USER", "patriotnewsactivism"),
  donationInfoText: optEnv("DONATION_INFO_TEXT", DEFAULT_DONATION_INFO),
} as const;
