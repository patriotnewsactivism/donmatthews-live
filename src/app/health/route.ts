import { handleVoiceHealth } from "@/lib/don-voice-vercel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(): Response {
  return handleVoiceHealth();
}
