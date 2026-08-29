# Repository Guidelines — donmatthews.live

## Production truth
- The current Next.js flagship production service runs on an existing Google Cloud Run service.
- GitHub Actions may update only that verified existing service. Do not create a replacement service, guess project/region/service identifiers, or use mutable `latest` as release provenance.
- Production releases build an immutable Git-SHA image, update the existing service image, wait for the Ready revision, and verify `/api/health` reports the released SHA.
- Vercel integrations/statuses may still exist historically, but they are not the canonical current production deployment path.
- Railway is retired. Do not add Railway configuration, assumptions, secrets, or deployment instructions.

## Project structure
- Next.js App Router: pages/layouts/routes live in `src/app/`.
- API routes: `src/app/api/` — includes lead capture, webhook endpoints, and deployment health provenance.
- Shared UI: `src/components/`. Shared helpers: `src/lib/`.
- The WordPress rebuild under `wordpress-rebuild/` is a separate migration direction; it does not override current Cloud Run production truth until an explicit cutover is verified.

## Lead-retention rules
1. Never write leads, subscribers, or waitlist entries to `/tmp` or any other ephemeral filesystem path.
2. Current Next.js captures forward to the BuildMyBot CRM, persisted in Supabase, with Discord as a redundant fallback.
3. The WordPress replacement stores every signup in the site database (`{prefix}dm_leads`) before any notification is attempted. That database row is the record of truth.
4. WordPress administrators must retain CSV export capability for migration and backups.
5. Never return a success response for a lead unless at least one durable or human-recoverable capture path succeeded.

## Security
- GitHub webhook route (`/api/webhooks`) requires `GITHUB_WEBHOOK_SECRET`; never reintroduce a default-secret fallback.
- Do not commit deployment secrets, CRM secrets, database service keys, or webhook URLs.
- Do not print secret values in CI. Read-only target diagnostics may report only presence and non-sensitive deployment metadata.

## Music section rules
- Track order for "Bad Actors" Volume 1 is canonical and must not be reordered without Don's explicit direction: Silence Ain't Consent, Unbroken, In the Shadows Tonight, Double Dipped, Morgan County Blues, The Osteen Files (Exhibit L), A Warrant For A Lie, The Crowder Files, Eleven Months Too Long, Caught Red Handed, Osteen Lied, Land of the Free Unless Its Me, She Called The State, Osteen's Fall, The Gaslight Anthem, Governors Gone Too Far, Scandalous.
- All playback must remain in-page; never force navigation away merely to play a track.

## Brand rules
- Public-facing name is always **Don Matthews**, except where a legal or book context requires otherwise.
- Keep the approved black/gold flagship design language and distress-signal imagery consistent across the rebuild.
