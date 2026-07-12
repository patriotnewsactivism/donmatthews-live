# donmatthews.live

Personal brand flagship site for Matthew Reardon (pen name **Don Matthews**)
— USMC veteran, entrepreneur, AI builder, investigative journalist, civil
rights litigant, and songwriter (**Bad Actors** music project).

## Stack
- Next.js (`src/app` — App Router), TypeScript, Tailwind CSS
- Deployed on Railway (`railway.toml`, Dockerfile)

## What's on the site
- Personal/brand landing page
- **Bad Actors** — music section: full 17-track canonical album order,
  BandLab embed for in-page playback (never navigates away from the page)
- Lead capture / waitlist / notify endpoints (`src/app/api`)
- GitHub App webhook receiver (`/api/webhooks`) for deploy/CI event
  notifications

## Known gap — read before touching lead capture
The waitlist/notify API routes currently write to `/tmp`, which is
**ephemeral on Railway** (wiped on every restart/redeploy, and Railway
restarts failed containers automatically). There is no database, no email
notification, and no forwarding into BuildMyBot. Every lead captured here
today is functionally lost within one redeploy cycle. See `PLAN.md` for the
fix (forward captures into BuildMyBot's `/api/leads` or Supabase directly).

## Structure
- `src/app/` — pages and API routes (App Router)
- `src/components/` — UI components
- `src/lib/` — shared helpers

## Local dev
```
npm ci
npm run dev
```
