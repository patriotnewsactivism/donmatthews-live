# donmatthews.live

Personal brand flagship site for Don Matthews — entrepreneur, AI builder, investigative journalist, civil-rights litigant, author, and songwriter.

## Current delivery

- Next.js App Router (`src/app`), TypeScript, Tailwind CSS
- **Vercel is the canonical production platform** for `donmatthews.live` and `www.donmatthews.live`
- GitHub integration creates preview deployments for branches/PRs and production deployments from `main`
- The Don voice runtime is deployed in the same Vercel project through `/voice`, `/stream`, `/xai/sip`, and `/health`
- `/api/health` remains the flagship-site health endpoint; `/health` reports the voice runtime/integration state
- Google Cloud Run is retained only as a temporary rollback source during the voice cutover and is not the forward deployment target
- Railway is retired for this repository

## Production release contract

A release is complete only after:

1. CI/build succeeds for the exact commit.
2. The Vercel preview for the candidate commit is `READY`.
3. Required production environment variables are configured in Vercel and no secret is committed to Git.
4. The change is merged to `main` and the Vercel production deployment becomes `READY`.
5. `https://donmatthews.live/api/health` passes for the flagship site.
6. For voice changes, `https://donmatthews.live/health` passes and reports the intended integrations configured.
7. Voice releases are not considered complete until a real Telnyx call verifies two-way audio, the configured Don voice, DTMF/owner access as applicable, and clean hangup/session persistence.

Do not create substitute hosting services or reintroduce Cloud Run deployment workflows without an explicit rollback decision.

## Voice runtime

The shared voice implementation remains under `voice-agent/src`. Vercel adapters live in the Next.js app so the web application and voice backend ship from the same Git commit. See `voice-agent/README.md` for required environment variables and the cutover procedure.

## Platform direction

A custom WordPress rebuild under `wordpress-rebuild/` is a separate content/SEO migration track. It does not change the Vercel deployment contract for the current Next.js application unless a later explicit cutover replaces it.

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
