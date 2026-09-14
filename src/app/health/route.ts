import { handleVoiceHealth } from "@/lib/don-voice-vercel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  return handleVoiceHealth();
}
