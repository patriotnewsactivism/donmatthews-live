# Don Voice Agent

Voice agent for Don Matthews / donmatthews.live. It can answer questions from We The People News (`wtpnews.org`) and Civil Rights Hub (`civilrightshub.org`), provide support/donation information, persist memory across calls in Supabase, and unlock owner-only GitHub administration tools after caller-number plus passcode verification.

## Architecture

Telnyx managed Conversational AI is the primary architecture. The old xAI realtime/WebSocket bridge remains in the repository as an explicit rollback path while the managed assistant is proven in production.

```text
PRIMARY
Phone / Telnyx number
  -> TeXML POST https://www.donmatthews.live/voice
  -> <AIAssistant id="...">
  -> Telnyx managed telephony + STT + LLM + TTS
  -> HTTPS webhook tools on www.donmatthews.live

ROLLBACK
Phone / Telnyx number
  -> TeXML POST https://www.donmatthews.live/voice
  -> <Stream ...>
  -> legacy xAI realtime WebSocket bridge
```

The managed path does **not** send live call audio through Vercel. Vercel serves only the small TeXML response and normal HTTPS tool/dynamic-variable requests. This removes the long-lived WebSocket/function-duration problem from the primary call path.

`/voice`, `/telnyx/voice`, and `/twilio/voice` select the managed assistant whenever `TELNYX_ASSISTANT_ID` is available (directly from the environment or persisted in `voice_memory`). If no managed assistant is configured, they fall back to the legacy xAI stream when `XAI_API_KEY` is present.

## Managed Telnyx defaults

The provisioning code uses:

- LLM: `moonshotai/Kimi-K2.5`
- voice: `Telnyx.NaturalHD.andersen_johan`
- STT: `deepgram/flux`
- one fixed assistant voice for the full call
- Telnyx-hosted telephony/orchestration instead of a custom media bridge
- existing Don voice tools exposed as authenticated Telnyx webhook tools
- built-in hangup support

Every setting can be overridden with environment variables without changing code.

## Routes

Public telephony:

- `GET|POST /voice` — preferred TeXML webhook
- `GET|POST /telnyx/voice` — Telnyx compatibility alias
- `GET|POST /twilio/voice` — compatibility alias
- `GET /health` — reports managed/fallback mode and configuration state

Managed assistant support:

- `POST /api/voice/telnyx/dynamic` — initializes caller/session state for Telnyx dynamic variables; authenticated by a generated/explicit webhook token
- `POST /api/voice/telnyx/tool/[name]` — executes the existing article, memory, donation, verification, and admin tools; authenticated by a Telnyx-configured header token
- `POST /api/voice/telnyx/provision` — creates or updates the Telnyx assistant; protected by `ADMIN_PASSCODE`
- `POST /api/voice/telnyx/call` — optional outbound call endpoint; protected by `ADMIN_PASSCODE`

Legacy rollback:

- `GET /stream` — bidirectional media WebSocket used only by the legacy bridge
- `POST /xai/sip` — legacy xAI Direct SIP webhook

## Environment variables

Primary managed path:

- `TELNYX_API_KEY` — required to create/update the managed assistant and place outbound calls
- `TELNYX_ASSISTANT_ID` — optional after provisioning; if absent, the provisioner persists the created ID in Supabase `voice_memory`
- `TELNYX_AI_MODEL` — defaults to `moonshotai/Kimi-K2.5`
- `TELNYX_AI_VOICE` — defaults to `Telnyx.NaturalHD.andersen_johan`
- `TELNYX_STT_MODEL` — defaults to `deepgram/flux`
- `TELNYX_TOOL_TOKEN` — optional; if omitted, the server derives a one-way webhook token from `TELNYX_API_KEY`
- `TELNYX_TEXML_APP_ID` — optional for inbound-only use; required by the protected outbound-call endpoint
- `TELNYX_CALLER_ID` — optional for inbound-only use; required by the protected outbound-call endpoint
- `PUBLIC_BASE_URL=https://www.donmatthews.live`

Persistence and owner tools:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL` when needed by the selected persistence path
- `OWNER_PHONE`
- `ADMIN_PASSCODE`
- `MAX_VERIFY_ATTEMPTS` — defaults to `3`
- `GITHUB_TOKEN` — optional; enables owner GitHub tools
- `GITHUB_USER` — defaults to `patriotnewsactivism`
- `DONATION_INFO_TEXT` — optional override

Legacy rollback only:

- `XAI_API_KEY`
- `XAI_AGENT_ID`
- `STREAM_TOKEN`

Secrets belong in the hosting provider environment. Do not commit them.

## Provisioning

After `TELNYX_API_KEY`, Supabase credentials, `ADMIN_PASSCODE`, and `PUBLIC_BASE_URL` exist in the Vercel production environment, call the protected provisioning endpoint once. It creates the assistant when none exists or updates the existing assistant and promotes the new configuration to main.

Provisioning also registers all existing voice tools as Telnyx webhook tools and configures the dynamic-variable callback. The assistant ID is stored in `voice_memory` when `TELNYX_ASSISTANT_ID` is not explicitly set, allowing the runtime to switch to managed mode without another source-code change.

A Telnyx phone number can then be attached to the assistant, or an existing TeXML application/number can keep calling `https://www.donmatthews.live/voice`. The `/voice` response connects the call to the managed assistant.

## Outbound calls

When `TELNYX_TEXML_APP_ID` and `TELNYX_CALLER_ID` are configured, the protected `/api/voice/telnyx/call` route accepts JSON like:

```json
{ "to": "+15551234567" }
```

and starts the call with the same managed assistant.

## Owner ("sudo") mode

Owner tools still require both conditions: the normalized caller number equals `OWNER_PHONE`, and `verify_access` succeeds with `ADMIN_PASSCODE`. Caller ID alone is not trusted. Failed verification attempts remain limited by `MAX_VERIFY_ATTEMPTS`.

Every `admin_*` and `verify_access` invocation is written to `admin_audit_log`. Admin tools operate through the GitHub API; the voice agent does not expose arbitrary shell execution.

## Persistence

| Table | Purpose |
|---|---|
| `voice_sessions` | one row per call |
| `voice_messages` | user, assistant, and tool messages |
| `voice_memory` | durable facts plus the managed assistant ID when environment configuration does not provide it |
| `voice_articles` | ingested article content |
| `admin_audit_log` | owner/admin action audit records |

## Local standalone runner

The `voice-agent/src/index.ts` standalone server remains the legacy/rollback implementation for Cloud Run or another container runtime. It has not been deleted. The Vercel-managed path lives in `src/app`, `src/lib`, and `voice-agent/src/telnyx-managed.ts`.

1. `cd voice-agent && npm install`
2. Copy `.env.example` to `.env` and fill the required values.
3. Apply the schema and seed facts with `npm run db:setup`.
4. Ingest article content with `npm run ingest`.
5. Run `npm run check`, `npm run typecheck`, and `npm run build`.

## Security

- Never commit Telnyx, xAI, Supabase, GitHub, database, stream-token, or owner passcode secrets.
- `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` remain server-only.
- Managed tool webhooks fail closed when their token is absent or incorrect.
- Provisioning/outbound routes fail closed when `ADMIN_PASSCODE` is absent.
- The owner caller number is only a first factor; privileged tools still require the passcode.
- The legacy media/WebSocket code remains isolated as rollback and is not used when the managed assistant ID exists.
