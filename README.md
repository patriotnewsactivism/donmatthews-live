# donmatthews.live

Personal brand flagship site for Don Matthews — entrepreneur, AI builder,
investigative journalist, civil-rights litigant, author, and songwriter.

## Current delivery
- Next.js App Router (`src/app`), TypeScript, Tailwind CSS
- Production runs on the verified existing Google Cloud Run service configured in GitHub Actions
- Releases use immutable Git-SHA container tags and update only that existing service
- `/api/health` exposes the deployed build SHA for release verification
- Vercel may still have historical project/status integrations, but it is not the canonical current production deployment path
- Railway is retired

## Production release contract
A release is complete only after:
1. CI/build succeeds for the exact commit.
2. Google authentication succeeds with the repository's configured deployment identity.
3. The workflow describes the exact existing Cloud Run service before changing it.
4. Cloud Build publishes an immutable image tagged with the Git SHA.
5. `gcloud run services update` changes only the existing service image while preserving its existing configuration.
6. The latest created revision becomes the latest Ready revision.
7. The live service `/api/health` reports the same Git SHA.

Do not create a substitute Cloud Run service or guess project, region, service, domain, or secret values.

## Platform direction
A custom WordPress rebuild under `wordpress-rebuild/` is a separate migration track for content, structured archives, SEO, and lead management. It does not replace the current Cloud Run production service until an explicit cutover is completed and verified.

## Lead retention
The old `/tmp` lead-storage approach is retired. The current Next.js forms
forward leads into the BuildMyBot CRM, which persists them in Supabase, with
Discord as a redundant human-visible fallback. The WordPress replacement stores every signup directly in a WordPress database table and retains administrator CSV export. Notification email is secondary; the durable database row is the source of truth.

## What's on the site
- Personal/brand flagship
- Projects and AI/software ventures
- We The People News tie-ins
- American Injustice book hub
- Bad Actors music and releases
- The Record / case timeline
- Press, media, support, and contact

## Structure
- `src/app/` — current Next.js pages and API routes
- `src/components/` — current UI components
- `src/lib/` — current shared helpers
- `wordpress-rebuild/` — WordPress migration theme/plugin work

## Local development
```bash
npm ci
npm run dev
```

Production-equivalent build check:
```bash
npm ci
npm run build
```
