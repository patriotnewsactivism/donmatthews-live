# donmatthews.live

Personal brand flagship site for Don Matthews — entrepreneur, AI builder, investigative journalist, civil-rights litigant, author, and songwriter.

## Current delivery

- Next.js App Router (`src/app`), TypeScript, Tailwind CSS
- Vercel is the primary web host for `donmatthews.live` and `www.donmatthews.live`
- **The Don voice agent remains live on Google Cloud Run for now**
- Vercel contains a tested hot-standby copy of the voice runtime at `/voice`, `/stream`, `/xai/sip`, and `/health`
- GitHub integration keeps the Vercel standby code synchronized from the same repository and commit history
- `/api/health` is the flagship-site health endpoint; `/health` is the Vercel voice-standby health endpoint
- Railway is retired for this repository

## Voice failover contract

Cloud Run remains the active phone runtime until an explicit failover. Vercel is maintained so a Cloud Run shutdown does not require a rewrite or emergency rebuild.

A Vercel voice failover is ready when:

1. CI/build succeeds for the exact commit.
2. The Vercel deployment is `READY`.
3. The Vercel production project has the required voice environment variables and secrets.
4. `https://www.donmatthews.live/health` returns HTTP 200 with `ok: true`, `platform: vercel`, and `xai: configured`.
5. The Vercel routes `/voice`, `/telnyx/voice`, `/twilio/voice`, `/stream`, and `/xai/sip` are present.

Once those conditions are met, the actual emergency cutover is only a carrier routing change: point the Telnyx voice webhook to `POST https://www.donmatthews.live/voice`, then place a verification call. Do not delete Cloud Run until the Vercel call path has been verified.

## Voice runtime

The shared voice implementation remains under `voice-agent/src`. Vercel adapters live in the Next.js app so the standby backend ships from the same Git commit as the site. See `voice-agent/README.md` and `docs/VERCEL_VOICE_FAILOVER.md` for the exact failover procedure.

## Platform direction

A custom WordPress rebuild under `wordpress-rebuild/` is a separate content/SEO migration track. It does not change the current Vercel web deployment or the Cloud Run voice-primary / Vercel voice-standby arrangement unless an explicit cutover is made.

## Lead retention

The old `/tmp` lead-storage approach is retired. Current Next.js forms forward leads into the BuildMyBot CRM, which persists them in Supabase, with Discord as a redundant human-visible fallback. The WordPress replacement stores signups directly in a WordPress database table and retains administrator CSV export. Notification email is secondary; durable storage is the source of truth.

## What's on the site

- Personal/brand flagship
- Projects and AI/software ventures
- We The People News tie-ins
- American Injustice book hub
- Bad Actors music and releases
- The Record / case timeline
- Press, media, support, and contact

## Structure

- `src/app/` — Next.js pages, API routes, and Vercel voice routes
- `src/components/` — UI components
- `src/lib/` — shared helpers and Vercel voice adapter
- `voice-agent/` — shared/local voice-agent engine
- `docs/VERCEL_VOICE_FAILOVER.md` — standby and emergency cutover runbook
- `wordpress-rebuild/` — separate WordPress migration work

## Local development

```bash
npm ci || npm install
npm run dev
```

Production-equivalent build check:

```bash
npm ci || npm install
npm run build
```
