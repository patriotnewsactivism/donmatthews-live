# donmatthews.live — Build Plan

Last updated 2026-08-22.

## Done
- [x] Public-facing brand standardized as Don Matthews.
- [x] Full 17-track Bad Actors Volume 1 tracklist wired for in-page playback.
- [x] Current application is delivered through Vercel; Railway is retired.
- [x] Next.js waitlist/notify routes no longer write to ephemeral `/tmp`; they
      forward to the BuildMyBot CRM with a Discord fallback.
- [x] WordPress rebuild branch created without touching production code.
- [x] Custom dark/gold WordPress block theme scaffolded.
- [x] Structured WordPress content types created for Projects, The Record,
      Music, and Press/Media.
- [x] Durable WordPress lead table, REST capture endpoint, admin view, and CSV
      export added. WordPress database rows are the lead source of truth after
      cutover.

## Next — in priority order
1. **Publish the new flagship preview on Vercel.** Keep the permanent WordPress
   architecture visible in the redesign while WordPress provisioning is being
   completed.
2. **Provision WordPress staging** and activate the custom theme plus
   `don-matthews-core` plugin.
3. **Migrate content and assets** from the current Next.js components into
   WordPress pages and structured content entries.
4. **Migrate existing leads** from the BuildMyBot/Supabase pipeline into the
   WordPress lead table before final cutover, preserving source attribution.
5. **SEO and discovery:** canonicals, Open Graph, schema/JSON-LD, sitemap,
   redirects, and search/AI-friendly page structure.
6. **QA and cutover:** mobile, forms, lead export, analytics, backups, redirects,
   then point donmatthews.live at WordPress only after the replacement passes.

## Deployment policy
- Railway: retired; do not add Railway configuration or dependencies.
- Vercel: temporary Next.js production/preview delivery during migration.
- WordPress: permanent content platform and final destination for the domain.
- Never use ephemeral filesystem storage for leads or mailing-list signups.
