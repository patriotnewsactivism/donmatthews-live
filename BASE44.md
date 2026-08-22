# BASE44.md — Instructions for the Base44 Superagent working on this repo

## Non-negotiable rules
1. GitHub writes use the configured authorized GitHub connection; never hardcode tokens into source.
2. No unilateral destructive infrastructure action. Preserve a rollback path for production changes.
3. Railway is retired. Do not add Railway services, configs, secrets, or deployment instructions.
4. Current Next.js delivery is Vercel. Permanent site direction is the custom WordPress rebuild under `wordpress-rebuild/`.

## Verified platform state — 2026-08-22
- The current application is deployed through Vercel from GitHub.
- `donmatthews.live` and `www.donmatthews.live` are attached to the Vercel `donmatthews` project during migration.
- The WordPress replacement includes a custom dark/gold block theme and `don-matthews-core` plugin.
- The repository contains no active Railway deployment configuration.

## Lead capture
Lead retention is non-negotiable.

Current Next.js path:
- `/api/waitlist` and `/api/notify` forward captures into the BuildMyBot CRM.
- BuildMyBot persists those leads in Supabase.
- Discord is a redundant human-visible recovery channel if the CRM forward fails.
- Never write lead data to `/tmp` or any ephemeral filesystem.

WordPress replacement:
- `don-matthews-core` creates `{prefix}dm_leads`.
- Every signup is inserted into WordPress before notification email is attempted.
- Administrators can review leads and export the complete table as CSV.
- Existing CRM leads must be imported before final WordPress cutover.

## Brand and content
- Public-facing name is Don Matthews except where a legal/book context requires otherwise.
- Preserve the black/gold flagship identity.
- Keep WTP News as the newsroom and donmatthews.live as the personal flagship.
- Keep Bad Actors playback in-page and preserve the canonical track order documented in `AGENTS.md`.
