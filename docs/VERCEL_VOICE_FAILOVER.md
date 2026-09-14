# Vercel Voice Failover Runbook

## Purpose

Google Cloud Run remains the active Don voice runtime. Vercel is maintained as a hot standby so a Cloud Run suspension or shutdown does not require code changes, a new deployment architecture, or emergency development work.

## Standby endpoint

- Health: `https://www.donmatthews.live/health`
- Voice webhook: `POST https://www.donmatthews.live/voice`
- Media stream: `wss://www.donmatthews.live/stream`
- xAI SIP webhook: `POST https://www.donmatthews.live/xai/sip`

Compatibility routes are also present at `/telnyx/voice` and `/twilio/voice`.

## Standby readiness checklist

The Vercel standby is considered ready only when all of the following are true:

- The latest `main` deployment is `READY` in Vercel.
- GitHub CI passes.
- `/health` returns HTTP 200 with `ok: true` and `platform: vercel`.
- `/health` reports `xai: configured`.
- The intended Supabase memory configuration is present.
- `PUBLIC_BASE_URL` is set to `https://www.donmatthews.live` or the adapter is allowed to normalize the apex hostname to `www`.
- `STREAM_TOKEN`, `OWNER_PHONE`, and `ADMIN_PASSCODE` are configured as production environment variables.
- Any intended GitHub administration token is configured server-side only.

Never place secret values in Git, this document, issue comments, pull requests, or deployment logs.

## Emergency cutover

If Cloud Run becomes unavailable:

1. Check `https://www.donmatthews.live/health`.
2. In the Telnyx TeXML application currently assigned to the Don voice number, change the voice webhook to `POST https://www.donmatthews.live/voice`.
3. Save the Telnyx application change. No code deployment is required if the standby readiness checklist is already green.
4. Place one inbound test call immediately.
5. Verify the greeting uses the configured Don voice, caller audio reaches the agent, response audio reaches the caller, and the call hangs up cleanly.
6. If owner mode is required, verify DTMF/passcode handling from the configured owner number.
7. Verify the call/session appears in persistence when Supabase memory is enabled.

## Rollback

If the Vercel call fails and Cloud Run is still available, restore the prior Telnyx Cloud Run webhook URL. Do not delete or disable the Cloud Run service until Vercel has passed a real live call.

## Platform limitation

Vercel Function/WebSocket maximum-duration limits apply to active phone calls. The standby is intended first as continuity/failover coverage; long-call behavior should be validated against the active Vercel plan before Cloud Run is permanently retired.
