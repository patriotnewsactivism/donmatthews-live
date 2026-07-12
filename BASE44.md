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

## Lead capture — FIXED and verified live (2026-07-12)
Was flagged as a data black hole (`/tmp` writes, ephemeral, all leads
lost). Turned out the forwarding code (`src/lib/portfolio.ts`) already
existed but was non-functional: `PORTFOLIO_INTAKE_SECRET` unset here, and
BuildMyBot's `PORTFOLIO_OWNER_EMAIL` defaulted to a non-existent placeholder
account, so every real submission was actually returning a live 503 error
to visitors. Fixed: fresh shared secret set identically on this Railway
service and the BuildMyBot Vercel project, `PORTFOLIO_OWNER_EMAIL` pointed
at Don's real account, both redeployed, verified end-to-end with a real
Supabase `leads` row (then cleaned up the test row). If this ever breaks
again, check both env vars first — the code path itself is solid.
