-- Don Matthews voice agent schema (apply in the same Supabase project as donmatthews.live)
-- Run via: supabase db push  (or run each statement in the Supabase SQL editor)

create extension if not exists pgcrypto;

-- One row per phone call
create table if not exists public.voice_sessions (
  session_id text primary key,
  call_sid text unique,
  caller_number text not null,
  is_owner boolean not null default false,
  sudo_verified boolean not null default false,
  verify_attempts integer not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  summary text
);

-- Every user/assistant/tool message in every call
create table if not exists public.voice_messages (
  id bigserial primary key,
  session_id text not null references public.voice_sessions(session_id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'tool')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Long-term key/value memory the agent can read/write at runtime
create table if not exists public.voice_memory (
  id bigserial primary key,
  label text not null unique,
  detail text not null,
  updated_at timestamptz not null default now()
);

-- Ingested articles from wtpnews.org / civilrightshub.org for retrieval
create table if not exists public.voice_articles (
  id bigserial primary key,
  source text not null,
  url text not null unique,
  title text not null,
  summary text not null,
  published_at timestamptz,
  ingested_at timestamptz not null default now()
);

create index if not exists voice_articles_source_idx on public.voice_articles (source);
create index if not exists voice_articles_published_idx on public.voice_articles (published_at desc);

-- Audit trail for every admin-tool invocation
create table if not exists public.admin_audit_log (
  id bigserial primary key,
  session_id text not null,
  caller_number text not null,
  tool text not null,
  args text not null,
  ok boolean not null,
  result text,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);