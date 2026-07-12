# BASE44.md — Instructions for the Base44 Superagent working on this repo

## Non-negotiable rules
1. **GitHub writes always use `GITHUB_TOKEN_4`.**
2. **No unilateral irreversible action** — deploy/infra changes need Don's
   explicit go-ahead.
3. **Keep Vercel/Railway env symmetry in mind** even though this specific
   site deploys only to Railway — if any shared secret (e.g.
   `GITHUB_WEBHOOK_SECRET`) is rotated, make sure it's updated everywhere
   it's used, not just here.

## Verified current state (2026-07-12)
- Site is live and healthy on Railway.
- Nav logo correctly shows "DON MATTHEWS" (fixed from a hardcoded
  "MATTHEW REARDON" bug).
- GitHub App webhook delivers successfully to `/api/webhooks` with a
  signed 200 OK — `GITHUB_WEBHOOK_SECRET` is set in both GitHub and Railway.
- Music section has the full, correct 17-track "Bad Actors" Volume 1 order
  with in-page BandLab playback wired in.
- An empty, zero-deployment "web" Railway service was deleted from this
  project (cleanup, not a functional loss).

## Known open gap — flagged, not yet fixed
**Lead capture is a data black hole.** The waitlist/notify API routes write
JSON to `/tmp`, which Railway wipes on every restart or redeploy. There is
no database, no email notification, and no connection to BuildMyBot. This
means the site's entire lead-generation function currently produces
nothing durable — every visitor who submits the form is lost. This is a
real, live bug, not a hypothetical one. Recommended fix: POST captures
straight into BuildMyBot's `/api/leads` endpoint (or directly into
Supabase's `leads` table with a service-role key), so BuildMyBot's AI Team
lead-followup worker can nurture them automatically. This is the
single highest-leverage fix available on this repo — treat it as priority
one, ahead of any new page/feature work, once Don approves the infra
change (it touches env vars / a new outbound API call).
