# Repository Guidelines — donmatthews.live

## Project structure
- Next.js App Router: pages/layouts/routes live in `src/app/`.
- API routes: `src/app/api/` — includes lead capture (waitlist/notify) and
  the GitHub App webhook receiver.
- Shared UI: `src/components/`. Shared helpers: `src/lib/`.
- Deployed on Railway via `Dockerfile` + `railway.toml`. Build: `next build`.
  Start: `next start -p ${PORT:-3000}`.

## Known issues to fix before extending
1. **Lead capture writes to `/tmp`** — ephemeral storage on Railway, wiped
   on every restart. No DB, no email, no forwarding anywhere. Don't build
   more features on top of this path until it's fixed (see PLAN.md) —
   anything layered on an ephemeral store inherits the same data loss.
2. **GitHub webhook route** (`/api/webhooks`) previously fell back to a
   hardcoded `"default_secret"` when `GITHUB_WEBHOOK_SECRET` was unset, and
   used non-constant-time comparison. Fixed 2026-07-12 — `GITHUB_WEBHOOK_SECRET`
   is now required and set in Railway. Verify it's still set before assuming
   webhook delivery works; don't reintroduce a default-secret fallback.
3. **Nav logo** previously hardcoded "MATTHEW REARDON" instead of "DON
   MATTHEWS" (the pen name is the public-facing brand). Fixed 2026-07-12 —
   don't reintroduce the legal name in user-facing UI; legal name only
   belongs in the book's front-matter disclosure, not site chrome.

## Music section rules
- Track order for "Bad Actors" Volume 1 is canonical and must not be
  reordered without Don's explicit direction: Silence Ain't Consent,
  Unbroken, In the Shadows Tonight, Double Dipped, Morgan County Blues,
  The Osteen Files (Exhibit L), A Warrant For A Lie, The Crowder Files,
  Eleven Months Too Long, Caught Red Handed, Osteen Lied, Land of the Free
  Unless Its Me, She Called The State, Osteen's Fall, The Gaslight Anthem,
  Governors Gone Too Far, Scandalous.
- All playback must be in-page (current BandLab embed) — never navigate
  the user away from the site to play a track.

## Brand rules
- Public-facing name is always **Don Matthews**, never the legal name
  (Matthew Reardon), except in required legal/book front-matter contexts.
- Flag imagery: upside-down American flag as a distress signal — this is
  the approved motif across Don's brand assets, replacing any other
  patriotic/law-enforcement imagery.
