# Don Voice Agent

Voice agent that answers phone calls as Don Matthews. It answers questions from We The People News (`wtpnews.org`) and Civil Rights Hub (`civilrightshub.org`), gives donation/support information, can persist memory across calls in Supabase, and can unlock owner-only GitHub administration tools after phone-number plus passcode verification.

## Current production arrangement

**Google Cloud Run remains the live phone runtime for now.** Vercel is maintained as a hot standby in the same `donmatthews-live` project that serves the website.

The standby architecture is already implemented:

```text
Phone -> Telnyx -> POST https://www.donmatthews.live/voice
                   -> wss://www.donmatthews.live/stream
                   -> xAI Realtime WebSocket
                   -> response audio back to Telnyx
```

The apex hostname redirects to `www.donmatthews.live`; telephony and WebSocket traffic should use the `www` host directly. The Vercel adapter also normalizes an apex `PUBLIC_BASE_URL` to `www` so a stale apex setting does not create a redirect in the media path.

Vercel standby routes:

- `GET /health` — voice runtime health/configuration check
- `GET|POST /voice` — primary failover voice webhook
- `GET|POST /telnyx/voice` — Telnyx compatibility alias
- `GET|POST /twilio/voice` — Twilio compatibility alias
- `GET /stream` — bidirectional media WebSocket
- `POST /xai/sip` — xAI Direct SIP webhook

The `voice-agent/src` directory remains the shared voice engine and local standalone runner. Vercel adapters live under `src/app` and `src/lib`, so Cloud Run and Vercel use the same core voice implementation rather than two divergent systems.

## Required Vercel environment variables

Set secrets in Vercel Project Settings -> Environment Variables. Do **not** commit them.

Required for live calling:

- `XAI_API_KEY`
- `XAI_AGENT_ID` (defaults to the configured Don agent ID when omitted)
- `PUBLIC_BASE_URL=https://www.donmatthews.live`
- `STREAM_TOKEN`
- `OWNER_PHONE`
- `ADMIN_PASSCODE`

Required for persistent memory:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` when the selected persistence path requires it

Optional owner administration:

- `GITHUB_TOKEN`
- `GITHUB_USER` — defaults to `patriotnewsactivism`

Other optional settings:

- `MAX_VERIFY_ATTEMPTS` — defaults to `3`
- `DONATION_INFO_TEXT`

The runtime fails closed for owner access when `ADMIN_PASSCODE` is absent. A missing `XAI_API_KEY` makes `/health` return HTTP 503 and the voice webhook returns a controlled unavailable message instead of opening a broken media stream.

## Emergency failover

Do not rebuild the service during an outage. The Vercel routes are already deployed from the same repository.

When Vercel production health is fully configured, failover consists of:

1. Confirm `https://www.donmatthews.live/health` returns `ok: true`, `platform: vercel`, and `xai: configured`.
2. Point the Telnyx TeXML application's voice webhook to `POST https://www.donmatthews.live/voice`.
3. Place one verification call for greeting, two-way audio, voice consistency, DTMF/owner verification if enabled, and clean hangup/session persistence.
4. Keep Cloud Run available as rollback until the Vercel call succeeds.

See `docs/VERCEL_VOICE_FAILOVER.md` for the exact runbook.

## Local setup

1. `cd voice-agent && npm install`
2. Copy `.env.example` to `.env` and fill the required variables.
3. Apply the schema and seed facts with `npm run db:setup`.
4. Ingest article content with `npm run ingest`.
5. Run `npm run check`, `npm run typecheck`, and `npm run build`.
6. Start with `npm run dev` or `npm run start`.

## Owner ("sudo") mode

The agent grants owner tools only when both conditions hold: the normalized caller number equals `OWNER_PHONE`, and `verify_access` succeeds with `ADMIN_PASSCODE`. Caller ID alone is not trusted. Failed verification attempts are limited by `MAX_VERIFY_ATTEMPTS`.

Every `admin_*` and `verify_access` invocation is written to `admin_audit_log`. Admin tools operate through the GitHub REST API; there is no arbitrary shell-execution tool in the voice agent.

## Persistence

| Table | Purpose |
|---|---|
| `voice_sessions` | one row per call |
| `voice_messages` | user, assistant, and tool messages |
| `voice_memory` | durable remembered facts |
| `voice_articles` | ingested article content |
| `admin_audit_log` | owner/admin action audit records |

## Security notes

- Never commit xAI, Supabase, GitHub, stream-token, database, or passcode secrets.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` server-side only.
- Use a strong random `STREAM_TOKEN` for production.
- Keep GitHub token scopes as narrow as practical.
- The configured xAI agent owns the Don voice. Session updates must not hard-code a different voice.
- Vercel function/WebSocket duration limits apply to active calls.

## Scripts

- `npm run dev` / `npm run start` — local standalone server
- `npm run build` / `npm run typecheck` — compile/type-check standalone voice code
- `npm run check` — codec/utilities self-test
- `npm run ingest` — idempotently refresh article content
