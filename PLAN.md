# donmatthews.live — Build Plan

Last updated 2026-07-12.

## Done
- [x] Fixed nav logo hardcoding ("MATTHEW REARDON" → "DON MATTHEWS").
- [x] Fixed GitHub App webhook: correct endpoint (`/api/webhooks`),
      required signature secret (no more `"default_secret"` fallback),
      constant-time comparison. Verified live with a signed 200 OK.
- [x] Deleted orphaned, zero-deployment "web" Railway service.
- [x] Full 17-track "Bad Actors" Volume 1 tracklist wired in with in-page
      BandLab playback (replaces old teaser section).

## Next — in priority order
1. **Fix lead capture data loss (highest priority).** Waitlist/notify
   routes currently write to `/tmp` (ephemeral on Railway — wiped every
   restart). Replace with either:
   - POST directly into BuildMyBot's `/api/leads` endpoint, or
   - Write directly into Supabase's `leads` table (service-role key).
   Either option turns this site from a decorative funnel into a real
   pipeline source feeding BuildMyBot's AI Team lead-followup worker.
   This requires an infra/env change — confirm with Don before wiring the
   destination credential in.
2. **Per-track playback IDs.** Current BandLab embed is one general
   playlist link. Once individual BandLab track IDs are available for all
   17 songs, map each to its row for proper per-track playback instead of
   a single shared embed.
3. **Book site tie-in.** "American Injustice" cover/launch assets will
   eventually need a home here too — not yet scoped, revisit once the
   cover is finalized.

## Explicitly NOT planned
- No plan to move this site off Railway — Next.js + Railway is a fine fit
  and there's no active problem forcing a change.
