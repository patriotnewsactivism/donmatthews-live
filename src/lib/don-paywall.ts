// Don live-avatar paywall — server-only helpers.
//
// Rules (Matthew, Nov. 27, 2026):
// - Every visitor gets exactly 1 free minute talking with Don, ONCE per IP
//   address, ever. The same IP must never get a second free minute.
// - After that, $1/minute, sold as minute packs via Stripe Checkout.
// - 100% of the money funds the investigations and the projects.
// - Only a SHA-256 hash of the IP is stored. The raw IP is never stored,
//   logged, or sent anywhere.
//
// Persistence is Supabase (service role, server-only). Never /tmp or
// in-memory: either resets on deploy/restart and lets people re-claim the
// free minute.
//
// Tables (see supabase/migrations/20261127_don_paywall.sql):
// - don_paywall_ip: one row per IP hash, records that the free minute was
//   claimed. The row existing IS the claim; shared IPs (household/NAT)
//   share one free minute, per Matthew's call.
// - don_paywall_sessions: one row per browser token (a random UUID the hero
//   keeps in localStorage). Tracks free/paid seconds granted and used.
//   Remaining seconds = granted - used, clamped at 0.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";

export const FREE_SECONDS = 60;

export const MINUTE_PACKS = {
  "5": { minutes: 5, amountCents: 500, label: "5 minutes" },
  "10": { minutes: 10, amountCents: 1000, label: "10 minutes" },
  "20": { minutes: 20, amountCents: 2000, label: "20 minutes" },
} as const;

export type PackKey = keyof typeof MINUTE_PACKS;

export function isPackKey(value: unknown): value is PackKey {
  return typeof value === "string" && value in MINUTE_PACKS;
}

export interface PaywallConfig {
  supabaseUrl: string;
  serviceKey: string;
  stageUrl: string; // server-side base URL of the hosted Anam stage (https://...)
  stageWsUrl: string; // browser WS base URL of the hosted Anam stage (wss://...)
  stripeKey: string;
  webhookSecret: string;
  sharedSecret: string; // DON_PAYWALL_SHARED_SECRET — stage server -> repo auth
  supabaseReady: boolean;
  stageReady: boolean;
  stripeReady: boolean;
}

export function paywallConfig(): PaywallConfig {
  const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const stageUrl = (process.env.DON_STAGE_URL || "").trim().replace(/\/+$/, "");
  const stageWsUrl = (process.env.NEXT_PUBLIC_DON_STAGE_URL || "")
    .trim()
    .replace(/\/+$/, "");
  const stripeKey = (process.env.STRIPE_SECRET_KEY || "").trim();
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
  const sharedSecret = (process.env.DON_PAYWALL_SHARED_SECRET || "").trim();
  return {
    supabaseUrl,
    serviceKey,
    stageUrl,
    stageWsUrl,
    stripeKey,
    webhookSecret,
    sharedSecret,
    supabaseReady: Boolean(supabaseUrl && serviceKey),
    stageReady: Boolean(stageUrl),
    stripeReady: Boolean(stripeKey),
  };
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const cfg = paywallConfig();
  if (!cfg.supabaseReady) return null;
  return createClient(cfg.supabaseUrl, cfg.serviceKey, {
    auth: { persistSession: false },
  });
}

/** First hop of X-Forwarded-For (Vercel sets this). Null if unknowable. */
export function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  const xri = req.headers.get("x-real-ip");
  if (xri && xri.trim()) return xri.trim();
  return null;
}

/** One-way hash of the client IP. The raw IP is never persisted. */
export function hashIp(ip: string): string {
  const salt = process.env.DON_PAYWALL_IP_SALT || "";
  return createHash("sha256")
    .update(salt + ip)
    .digest("hex");
}

export function isBrowserToken(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      value,
    )
  );
}

export interface SessionLedger {
  browser_token: string;
  ip_hash: string;
  free_seconds_granted: number;
  free_seconds_used: number;
  paid_seconds_granted: number;
  paid_seconds_used: number;
}

export function remainingSeconds(s: SessionLedger): {
  free: number;
  paid: number;
  total: number;
} {
  const free = Math.max(0, s.free_seconds_granted - s.free_seconds_used);
  const paid = Math.max(0, s.paid_seconds_granted - s.paid_seconds_used);
  return { free, paid, total: free + paid };
}
