# Telnyx Managed Voice Cutover and Rollback Runbook

## Purpose

The target architecture is Telnyx managed Conversational AI. The website/Vercel deployment handles only lightweight TeXML and HTTPS tool callbacks; live phone audio remains inside Telnyx. The existing xAI/WebSocket service and Cloud Run deployment are retained temporarily as rollback until the managed path passes a real call.

## Target call path

```text
Caller
  -> Telnyx phone number / TeXML application
  -> POST https://www.donmatthews.live/voice
  -> <Connect><AIAssistant id="..."></AIAssistant></Connect>
  -> Telnyx managed telephony + STT + model + TTS
  -> authenticated HTTPS tools on www.donmatthews.live
```

The primary path does not require a Vercel WebSocket and does not proxy audio through the website runtime.

## Existing rollback path

The repository still contains the previous xAI realtime media bridge. When no managed Telnyx assistant ID is available and `XAI_API_KEY` exists, `/voice` automatically emits the legacy `<Stream>` TeXML instead. Cloud Run should not be removed until managed Telnyx calling has passed live validation.

## Required production configuration

Required to create/update a managed assistant:

- `TELNYX_API_KEY`
- `PUBLIC_BASE_URL=https://www.donmatthews.live`
- `ADMIN_PASSCODE`

Required to preserve memory, caller verification, and the current voice tools:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OWNER_PHONE`
- `ADMIN_PASSCODE`

Recommended:

- `TELNYX_TOOL_TOKEN` as an explicit high-entropy webhook secret. If omitted, the server derives a one-way token from `TELNYX_API_KEY`.
- `GITHUB_TOKEN` and `GITHUB_USER` only if owner GitHub tools are intended.

Optional overrides:

- `TELNYX_ASSISTANT_ID`
- `TELNYX_AI_MODEL`
- `TELNYX_AI_VOICE`
- `TELNYX_STT_MODEL`
- `TELNYX_TEXML_APP_ID`
- `TELNYX_CALLER_ID`

`TELNYX_TEXML_APP_ID` and `TELNYX_CALLER_ID` are only required for the protected outbound-call API.

Never put secret values in Git, issue comments, PR comments, deployment logs, or this document.

## Provision the managed assistant

After the production environment variables are present, call:

`POST https://www.donmatthews.live/api/voice/telnyx/provision`

using the production owner authorization header. The route fails closed if owner authorization or `TELNYX_API_KEY` is missing.

The provisioner:

1. Creates the Telnyx assistant when one does not already exist.
2. Updates/promotes the existing assistant when an ID is already configured or persisted.
3. Registers the existing article, memory, donation, verification, and GitHub admin functions as authenticated Telnyx webhook tools.
4. Configures the dynamic-variable initialization webhook.
5. Uses the configured fixed Telnyx voice, STT model, and LLM.
6. Persists a newly created assistant ID in Supabase `voice_memory` when `TELNYX_ASSISTANT_ID` is not set explicitly.

## Number assignment options

### Reuse the current number

No new phone number is required. Keep the current Telnyx number attached to its TeXML application and point that application's voice webhook to:

`POST https://www.donmatthews.live/voice`

Once a managed assistant ID is configured, `/voice` will return `<AIAssistant>` TeXML. If the managed ID is absent but the legacy xAI credentials remain, `/voice` falls back to the existing stream path.

### Give the assistant its own number

A separate Telnyx number can be assigned to the managed assistant. This is useful if Don's AI assistant should have a dedicated public number while another number keeps its existing routing.

## Validation before declaring cutover complete

1. `https://www.donmatthews.live/health` returns HTTP 200 and reports `mode: telnyx-managed`.
2. `telnyx.assistant`, `telnyx.provisioningApi`, and `telnyx.toolSecurity` report configured.
3. Place an inbound test call.
4. Confirm the greeting identifies itself as Don Matthews' AI voice agent rather than pretending to be Don personally.
5. Confirm the same male voice remains active for the entire call; there must be no unexplained switch to a second voice.
6. Confirm caller speech is recognized correctly and barge-in/turn-taking feels natural.
7. Ask a question that requires `search_articles`; confirm the agent grounds the answer in retrieved content.
8. Ask for donation/support information; confirm the existing tool works.
9. From the configured owner number, test owner verification and one read-only admin tool.
10. Confirm an unverified caller cannot invoke an owner tool.
11. Confirm the call can hang up cleanly.
12. Confirm the call/session appears in persistence when Supabase is enabled.
13. If outbound calling is desired, configure `TELNYX_TEXML_APP_ID` and `TELNYX_CALLER_ID`, then test the protected outbound call route with a controlled destination.

## Rollback

If the managed assistant fails during commissioning:

1. Leave Cloud Run intact.
2. Restore the prior Telnyx application routing if it had been changed away from the old Cloud Run endpoint, or remove/disable the managed assistant ID so `/voice` selects the legacy xAI fallback when its credentials are present.
3. Place a verification call on the legacy path.
4. Do not delete managed-agent code; fix it on a branch and repeat validation.

The migration is considered complete only after a real phone call validates two-way speech, fixed voice identity, tool calls, owner controls, and clean hangup.

## Cost-control notes

The managed configuration intentionally keeps optional Telnyx noise suppression disabled by default and uses Telnyx-native STT/TTS so the primary path does not pay for or operate the old custom media bridge. Model, voice, and STT remain environment-configurable for future cost/quality tuning without a code rewrite.
