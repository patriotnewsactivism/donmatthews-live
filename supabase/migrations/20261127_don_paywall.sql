-- Don live-avatar paywall (Nov. 27, 2026).
-- One free minute per IP address, ever; $1/minute after that (Stripe packs).
-- Apply in the Supabase dashboard: SQL Editor -> paste -> Run.
-- Or: supabase db push (see docs/don-paywall.md).
--
-- Privacy: only SHA-256 hashes of IPs are stored. Raw IPs are never stored.
-- RLS is enabled with NO policies: only the service-role key (server-only,
-- Vercel env SUPABASE_SERVICE_ROLE_KEY) can read/write these tables.
-- The publishable key cannot touch them.

create table if not exists public.don_paywall_ip (
  ip_hash text primary key,
  free_used boolean not null default true,
  first_seen timestamptz not null default now()
);

create table if not exists public.don_paywall_sessions (
  browser_token text primary key,
  ip_hash text not null references public.don_paywall_ip (ip_hash),
  free_seconds_granted integer not null default 0,
  free_seconds_used integer not null default 0,
  paid_seconds_granted integer not null default 0,
  paid_seconds_used integer not null default 0,
  stripe_checkout_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists don_paywall_sessions_ip_hash_idx
  on public.don_paywall_sessions (ip_hash);

alter table public.don_paywall_ip enable row level security;
alter table public.don_paywall_sessions enable row level security;

-- No policies are created on purpose: anon/authenticated roles get nothing.
-- Only the service-role key (which bypasses RLS) reaches these tables.
