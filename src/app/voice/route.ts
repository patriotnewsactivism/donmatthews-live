import { handleVoiceRequest } from "@/lib/don-voice-vercel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export const GET = handleVoiceRequest;
export const POST = handleVoiceRequest;
