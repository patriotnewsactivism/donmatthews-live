# donmatthews.live Migration Map

This document maps the current Next.js one-page experience into the new WordPress information architecture.

## Current component → WordPress destination

| Current source | WordPress destination | Treatment |
|---|---|---|
| `Hero.tsx` | Home | Keep the identity and strongest visual asset; shorten copy and focus calls to action. |
| `BreakingUpdate.tsx` | Home + Updates | Home shows latest item; full updates receive permanent URLs. |
| `Projects.tsx` | Projects archive + `dm_project` entries | Convert each project into a structured item with status, excerpt, image, and external URL. |
| `StatsBar.tsx` | Home/About | Keep only defensible, maintainable metrics; avoid hard-coded stale counts. |
| `Music.tsx` | Music archive + `dm_release` entries | Preserve album/track information and embeds; give releases permanent URLs. |
| `SingleReleasePromo.tsx` | Music + campaign landing pages | Convert temporary promotions into reusable release/landing patterns. |
| `Book.tsx` | American Injustice | Expand into a dedicated book hub. |
| `BookExcerpt.tsx` | American Injustice / excerpts | Publish excerpts as real sections/pages rather than burying them on Home. |
| `Press.tsx` | Press | Preserve approved bio/headshot and add media appearances through `dm_appearance`. |
| `Support.tsx` | Support | Keep contribution paths but separate emergency/support messaging from portfolio copy. |
| `Bundle.tsx` | Products / Offers | Preserve only when the bundle is commercially active; avoid a permanent large homepage section for a coming-soon offer. |
| `FAQ.tsx` | Contextual FAQs | Split questions across Book, Projects, Press, and Support; retain a compact general FAQ if needed. |
| `Nav.tsx` | Global WordPress navigation | Replace anchor-only navigation with canonical page URLs. |
| `Footer.tsx` | Global template part | Preserve legal/policy and network links with a cleaner hierarchy. |

## New permanent URLs

- `/about/`
- `/projects/`
- `/technology/`
- `/american-injustice/`
- `/music/`
- `/record/`
- `/press/`
- `/updates/`
- `/support/`
- `/contact/`

## Homepage role

The homepage becomes a curated routing layer, not the complete archive. It should contain:

1. concise identity/hero
2. current priority/update
3. featured projects
4. American Injustice feature
5. selected music
6. selected Record entries
7. press/support routing

## Asset migration

Preserve and import from `public/images/`:

- `wanted-poster.jpg`
- `portrait-bw.jpg`
- `field-journalist.jpg`
- existing music cover art and release artwork

American Injustice needs the final approved cover asset before the book hub is considered launch-ready.

## SEO migration

Current homepage weaknesses to correct during WordPress launch:

- shorten page title to normal SERP length
- replace oversized meta description
- add canonical URLs
- add structured data
- expose XML sitemap
- provide unique metadata for major pages and structured content
- preserve social/Open Graph images

## Redirect strategy

The current site is primarily anchor-driven. After cutover, old anchor links should still land on the homepage without breaking, while all new sharing/search links use permanent page URLs. Any existing standalone policy routes (`/terms`, `/privacy-policy`, `/refund-policy`) should be preserved or redirected one-to-one.

## Lead capture

Do not migrate the current `/tmp`-backed capture behavior. WordPress forms must write to durable storage and/or a real email/CRM destination before the new site is launched.
