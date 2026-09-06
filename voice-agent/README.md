# Don Voice Agent

Voice agent that answers phone calls as Don Matthews: it answers questions from We The People News (`wtpnews.org`) and Civil Rights Hub (`civilrightshub.org`), gives donation/support info, persists memory across calls in Supabase, and — when called from the owner's phone with the passcode — unlocks admin tools that operate on the owner's GitHub repos through the GitHub API.

Architecture: Twilio Media Streams (μ-law 8 kHz) <-> x.ai Realtime WebSocket (PCM16 24 kHz), bridged in this Node service. No auxiliary TTS/STT services needed — the x.ai `agent_id` supplies voice and speech recognition.

```
Phone -> Twilio -> POST /twilio/voice (TwiML) -> wss /stream -> bridge -> wss api.x.ai/v1/realtime?agent_id=...
                     <- μ-law 8k <- upsample/downsample <- PCM 24k <-
```

## Setup

1. Install: `cd voice-agent && npm install`
2. Create `.env` from `.env.example` and fill in:
   - `XAI_API_KEY` — your x.ai key. `XAI_AGENT_ID` defaults to the agent shown in your snippet.
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — same Supabase project as donmatthews.live. Service role key must be set **only on the server**, never in the browser app.
   - `PUBLIC_BASE_URL` — the public HTTPS URL of this service (used to build the TwiML Stream URL).
   - `STREAM_TOKEN` — recommended: a random shared secret appended to the stream URL.
   - `OWNER_PHONE=+18328804970`, `ADMIN_PASSCODE=2269` — owner verification.
   - `GITHUB_TOKEN` — optional fine-grained PAT (repos + actions scope) to enable `admin_*` tools.
3. Apply `schema.sql` in the Supabase SQL editor (or `supabase db push`). Run the ingest once: `npm run ingest` (and re-run on a schedule, e.g., a cron/cloud scheduler, to keep articles fresh).
4. Deploy (Node 20+, HTTPS required by Twilio). Docker: `docker build -t don-voice-agent .` then run with `-p 8080:8080`. Any TLS-capable host works (Cloud Run, a VPS with Caddy, etc.). If you deploy on Cloud Run, deploy to your own existing service — do not create replacement services, and keep release provenance via immutable image tags.
5. Twilio console: take your voice-capable number -> Voice configuration -> "When a call comes in" -> **Webhook** -> `POST https://<host>/twilio/voice`.
6. Test: `npm run check`, then call the number. DTMF keys or spoken digits both work for the access code.

## Owner ("sudo") mode

- The agent only grants admin tools when **both** hold: the caller's number (normalized from Twilio `From`) equals `OWNER_PHONE`, and `verify_access` succeeds with `ADMIN_PASSCODE`.
- Caller ID can be spoofed on telco networks, so the phone number alone is worth nothing; the passcode is the real gate. Keep it 6+ digits if you can, and expect ~3 attempts max per call (configurable `MAX_VERIFY_ATTEMPTS`).
- Every `admin_*` and `verify_access` invocation is written to `admin_audit_log` (session, caller, tool, args, result).
- Admin tools act through the GitHub REST API only: list repos, repo status (commits/PRs/CI), read a file, open an issue, comment on a PR/issue, list workflows, trigger a workflow (deploy by default). There is no shell execution and no way to run arbitrary commands — the GitHub token and its scopes bound what the agent can do, and the audit log records everything.

## Persistence (Supabase)

| Table | Purpose |
|---|---|
| `voice_sessions` | one row per call (caller, owner flag, sudo state, verify attempts, summary) |
| `voice_messages` | every user/assistant/tool message per call |
| `voice_memory` | durable key/value facts for `remember` / `recall` across calls |
| `voice_articles` | ingested articles from wtpnews.org / civilrightshub.org, searched by `search_articles` |
| `admin_audit_log` | immutable admin action log |

## Tools exposed to the agent

Public: `search_articles`, `latest_articles`, `fetch_page` (allow-listed to wtpnews.org, civilrightshub.org, donmatthews.live), `donation_info` (from `voice_memory.donation_info` or `DONATION_INFO_TEXT`), `remember`, `recall`, `verify_access`. Owner-only (server-enforced, not just prompt-enforced): `admin_*` listed above.

## Security notes

- No secrets are printed in logs or returned to callers. Diagnostic output reports only presence (`admin: configured`).
- The x.ai key, Supabase service key, GitHub token, and passcode live only in server env vars.
- Do not enable admin tools (`GITHUB_TOKEN`) on the same deployment that faces arbitrary callers until you have watched the audit log behave for a while.
- Responses over the phone quote article text; the agent is instructed to cite source and never fabricate filings. Ingest drops ~all HTML and caps summary length (8k chars per item); `fetch_page` caps at 8k chars.

## Scripts

- `npm run dev` / `npm run start` — run the server (dev watch / compiled)
- `npm run build` / `npm run typecheck` — compile / type-check
- `npm run check` — audio codec + utils self-test (no network)
- `npm run ingest` — pull feeds into `voice_articles` (idempotent; upsert on URL)