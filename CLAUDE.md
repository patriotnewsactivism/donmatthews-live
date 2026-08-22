# CLAUDE.md

Guidance for Claude Code (or any AI coding agent) working in this repo.

## Quick orientation
The current public application is Next.js App Router with Tailwind and is delivered through Vercel. Railway is retired and must not be reintroduced.

The permanent rebuild lives under `wordpress-rebuild/`: a custom WordPress block theme plus the `don-matthews-core` plugin. WordPress is the final content platform and domain destination after migration QA.

## Lead capture
Read `PLAN.md` before changing capture flows.

- Never store leads in `/tmp` or any ephemeral filesystem.
- The current Next.js waitlist/notify routes forward to the BuildMyBot CRM, persisted in Supabase, with Discord as a recovery channel.
- The WordPress replacement writes each submission directly to its own `{prefix}dm_leads` database table before notifications are attempted.
- Preserve source attribution and CSV export capability.
- Never return a success response unless a durable or human-recoverable capture path succeeded.

## GitHub webhook route
`/api/webhooks` receives GitHub App events. It is signed with `GITHUB_WEBHOOK_SECRET` using constant-time comparison and has no fallback default. Do not weaken that check.

## Commands
```
npm ci        # install
npm run dev   # local dev server
npm run build # production build
npm run lint  # lint
```

## Platform direction
- Vercel: temporary runtime for the Next.js application and migration previews.
- WordPress: permanent content system and final destination.
- Railway: retired; no configs, secrets, deployment instructions, or assumptions.

## Relationship to the portfolio
The site is the flagship hub for Don Matthews and routes visitors into the broader portfolio. Lead capture, project discovery, American Injustice, The Record, music, press, and support should be organized as first-class destinations instead of being forced into a single monolithic landing page.
