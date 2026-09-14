# Don Voice Agent

Voice agent that answers phone calls as Don Matthews. It answers questions from We The People News (`wtpnews.org`) and Civil Rights Hub (`civilrightshub.org`), gives donation/support information, can persist memory across calls in Supabase, and can unlock owner-only GitHub administration tools after phone-number plus passcode verification.

## Production architecture

The production target is **Vercel**, in the same `donmatthews-live` project that serves `donmatthews.live`.

```text
Phone -> Telnyx -> POST https://donmatthews.live/voice
                   -> wss://donmatthews.live/stream
                   -> xAI Realtime WebSocket
                   -> response audio back to Telnyx
```

Vercel routes:

- `GET /health` — voice runtime health/configuration-presence check
- `GET|POST /voice` — primary Telnyx/TwiML-compatible voice webhook
- `GET|POST /telnyx/voice` — Telnyx compatibility alias
- `GET|POST /twilio/voice` — Twilio compatibility alias
- `GET /stream` — bidirectional media WebSocket
- `POST /xai/sip` — xAI Direct SIP webhook

The `voice-agent/src` directory remains the shared voice engine and local standalone runner. Vercel adapters live under `src/app` and `src/lib` so the website and voice backend deploy together from the same Git commit.

## Required Vercel environment variables

Set secrets in Vercel Project Settings -> Environment Variables. Do **not** commit them.

Required for live calling:

- `XAI_API_KEY`
- `XAI_AGENT_ID` (defaults to the configured Don agent ID when omitted)
- `PUBLIC_BASE_URL=https://donmatthews.live`
- `STREAM_TOKEN` — random shared secret protecting the media stream URL
- `OWNER_PHONE`
- `ADMIN_PASSCODE`

Required for persistent memory:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

Optional owner administration:

- `GITHUB_TOKEN` — fine-grained token with only the repository/actions permissions the owner intends to expose
- `GITHUB_USER` — defaults to `patriotnewsactivism`

Other optional settings:

- `MAX_VERIFY_ATTEMPTS` — defaults to `3`
- `DONATION_INFO_TEXT`

The runtime fails closed for owner access when `ADMIN_PASSCODE` is absent. `/health` reports only whether sensitive integrations are configured; it never returns secret values.

## Cutover procedure

1. Merge a Vercel-verified migration commit to `main`.
2. Confirm `https://donmatthews.live/health` returns `ok: true`, `platform: vercel`, and `xai: configured`.
3. Confirm Supabase/admin fields show the intended state.
4. Point the Telnyx TeXML application's voice webhook at `POST https://donmatthews.live/voice`.
5. Place a real inbound test call and verify greeting, conversational voice consistency, two-way audio, DTMF, and hangup cleanup.
6. Verify Supabase session persistence and owner verification if those features are enabled.
7. Only after the live call passes, retire the old Cloud Run service and Google deployment credentials.

The old Cloud Run instance is a rollback source during migration only; it is no longer the deployment target.

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
- Vercel function/WebSocket duration limits apply to active calls; clients/carriers must tolerate reconnect/termination behavior at the platform limit.

## Scripts

- `npm run dev` / `npm run start` — local standalone server
- `npm run build` / `npm run typecheck` — compile/type-check standalone voice code
- `npm run check` — codec/utilities self-test
- `npm run ingest` — idempotently refresh article content
