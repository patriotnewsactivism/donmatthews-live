# Don Voice Agent

Voice agent that answers phone calls as Don Matthews: it answers questions from We The People News (`wtpnews.org`) and Civil Rights Hub (`civilrightshub.org`), gives donation/support info, persists memory across calls in Supabase, and — when called from the owner's phone with the passcode — unlocks admin tools that operate on the owner's GitHub repos through the GitHub API.

Architecture: Telnyx TeXML Media Streams (μ-law 8 kHz; Twilio TwiML still accepted) <-> x.ai Realtime WebSocket (PCM16 24 kHz), bridged in this Node service. No auxiliary TTS/STT services needed — the x.ai `agent_id` supplies the configured voice and speech recognition. Session updates intentionally do not override that voice.

```
Phone -> Telnyx -> POST /voice (TeXML) -> wss /stream -> bridge -> wss api.x.ai/v1/realtime?agent_id=...
                     <- μ-law 8k <- upsample/downsample <- PCM 24k <-
```

## Live service

- Cloud Run (separate from the flagship Next.js service): `https://don-voice-agent-406797137160.us-central1.run.app`
- Telnyx number: `+1 832-975-7665` (TeXML app "Don Matthews Voice Agent" → `POST /voice`)
- Health: `GET /health`
- SIP join webhook (xAI Direct SIP): `POST /xai/sip`

Calls will greet only after `XAI_API_KEY` is set on that Cloud Run service (`gcloud run services update don-voice-agent --region us-central1 --update-env-vars XAI_API_KEY=...`). Create the key at https://console.x.ai. Admin GitHub tools stay off until `GITHUB_TOKEN` is set the same way.

## Setup

1. Install: `cd voice-agent && npm install`
2. Create `.env` from `.env.example` and fill in:
   - `XAI_API_KEY` — your x.ai key. `XAI_AGENT_ID` defaults to the voice agent id.
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `DATABASE_URL` — same Supabase project as donmatthews.live. Service role and database URLs stay **only on the server**.
   - `PUBLIC_BASE_URL` — the public HTTPS URL of this service (used to build the TeXML Stream URL).
   - `STREAM_TOKEN` — required in production: a random shared secret appended to the stream URL.
   - `OWNER_PHONE` and `ADMIN_PASSCODE` — owner verification. Do not commit the passcode.
   - `GITHUB_TOKEN` — optional fine-grained PAT (repos + actions scope) to enable `admin_*` tools.
3. Apply schema and seed donation facts: `npm run db:setup`. Then ingest articles: `npm run ingest` (re-run on a schedule to keep articles fresh).
4. Deploy this Node service on HTTPS (Cloud Run, a VPS with Caddy, etc.). This is a **separate** voice service — do not point it at the flagship Next.js Cloud Run service, and do not use mutable `latest` as release provenance.
5. Telnyx Mission Control: TeXML application Voice webhook `POST https://<host>/voice`. Assign a voice-capable number to that TeXML app. `/twilio/voice` remains as a compatibility alias.
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
