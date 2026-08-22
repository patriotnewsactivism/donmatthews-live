# donmatthews.live

Personal brand flagship site for Don Matthews — entrepreneur, AI builder,
investigative journalist, civil-rights litigant, author, and songwriter.

## Current delivery
- Next.js (`src/app` — App Router), TypeScript, Tailwind CSS
- Production and preview deployments run on Vercel via Git integration
- Railway is no longer part of the deployment architecture

## Permanent platform direction
The site is being rebuilt as a custom WordPress flagship under
`wordpress-rebuild/`. WordPress will own content, structured archives, SEO,
and lead capture. Vercel remains the temporary delivery layer for the
existing Next.js site and migration previews until the WordPress cutover.

## Lead retention
The old `/tmp` lead-storage approach is retired. The current Next.js forms
forward leads into the BuildMyBot CRM, which persists them in Supabase, with
Discord as a redundant human-visible fallback. The WordPress replacement goes
one step further: `don-matthews-core` stores every signup directly in a
WordPress database table and exposes an administrator CSV export. Notification
email is secondary; the database row is the source of truth.

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
- `wordpress-rebuild/` — permanent WordPress theme, core plugin, and migration work

## Local Next.js development
```bash
npm ci
npm run dev
```
