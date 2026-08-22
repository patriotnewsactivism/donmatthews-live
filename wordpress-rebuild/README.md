# donmatthews.live WordPress Rebuild

This directory contains the non-destructive WordPress replacement for the current Next.js/Railway site.

## Goal

Preserve the existing black/gold Don Matthews identity while replacing the single-page architecture with an SEO-friendly, maintainable WordPress platform.

## Primary site architecture

- Home — concise flagship overview and routing hub
- About — biography, mission, background, and personal story
- Projects — searchable portfolio of software, AI, journalism, and advocacy projects
- Technology — development capabilities, stack, case studies, and consulting/business work
- American Injustice — book hub, excerpts, launch updates, supporting record, and purchase links
- Music — Bad Actors and future releases, track stories, embeds, and downloads
- The Record — chronological legal/civil-rights record with source-driven entries
- Press — media bio, photos, appearances, interviews, and contact information
- Updates — project, book, media, and public case updates
- Support — contribution and purchase paths
- Contact — press, business, licensing, and general inquiries

## Content model

The companion `don-matthews-core` plugin owns structured content so it survives theme changes:

- `dm_project` — software, platforms, journalism initiatives, advocacy projects
- `dm_record` — dated legal/public-record timeline entries
- `dm_release` — music releases and documentary tracks
- `dm_appearance` — media appearances, interviews, podcasts, and press

## Design system

- Background: near-black
- Primary accent: muted gold
- Secondary text: cool gray
- Typography: Inter/system sans-serif
- Visual direction: editorial + premium technology portfolio, not a generic blog
- Large, restrained headlines; generous spacing; thin borders; minimal effects

## Migration rules

1. Keep `donmatthews.live` live on Railway during the rebuild.
2. Build and QA WordPress on staging first.
3. Preserve high-value URLs and assets where practical.
4. Do not duplicate full WTP News reporting; surface and link to it instead.
5. Migrate lead capture to durable storage before cutover.
6. Add canonical URLs, XML sitemap, structured data, Open Graph metadata, and per-page SEO metadata.
7. Cut the domain only after content, forms, mobile layout, redirects, analytics, and backups are verified.

## Relationship between properties

- `donmatthews.live` — Don Matthews flagship/personal platform
- `wtpnews.org` — newsroom and investigative journalism
- Product domains — independent SaaS products presented in the Don Matthews portfolio

The live Next.js source remains intact outside this directory.