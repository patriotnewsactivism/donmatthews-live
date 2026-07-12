# CLAUDE.md

Guidance for Claude Code (or any AI coding agent) working in this repo.

## Quick orientation
This is a Next.js (App Router) personal brand site, deployed on Railway.
It is intentionally simple — no heavy framework beyond Next.js/Tailwind, no
separate backend service (API routes live inside `src/app/api`).

## Before extending the lead-capture flow
Read `PLAN.md` first. The current waitlist/notify routes write to `/tmp`,
which does not persist across Railway restarts — this is a data-loss bug,
not a design choice. Don't add new fields, new capture points, or
dashboards on top of this storage until it's replaced with a real
destination (BuildMyBot's `/api/leads`, or a Supabase table directly).

## GitHub webhook route
`/api/webhooks` receives GitHub App events (currently just logs them). It's
signed with `GITHUB_WEBHOOK_SECRET` (constant-time compare, required — no
fallback default). If you give this route more responsibility (e.g.
posting deploy events to Discord), keep the signature check as-is; don't
weaken it in the name of convenience.

## Commands
```
npm ci        # install (never npm install in this repo)
npm run dev   # local dev server
npm run build # production build
npm run lint  # next lint
```

## Relationship to the rest of Don's portfolio
This site is meant to be a lead-generation funnel into BuildMyBot, not a
standalone island. Right now it isn't wired to anything (see the /tmp
issue above) — closing that gap is the highest-leverage next step, more
valuable than new pages/sections.
