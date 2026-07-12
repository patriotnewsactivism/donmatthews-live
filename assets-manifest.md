# donmatthews.live — Image Assets

Status: **Implemented** (2026-07-12) — images downloaded into `public/images/` and wired into components (no longer just a plan).

## Hero / Wanted Poster
File: `public/images/wanted-poster.jpg`
Usage: Hero section — rotated decorative accent, right side on large screens (`lg:` and up), hidden on mobile to avoid clutter.
Component: `src/components/Hero.tsx`

## Portrait — B&W Rain
File: `public/images/portrait-bw.jpg`
Usage: Press & Media section — headshot next to press bio.
Component: `src/components/Press.tsx`
Alt text: "Don Matthews — Matthew Reardon"

## Field Photo — Journalism (Cowboy Hat + Police Car)
File: `public/images/field-journalist.jpg`
Usage: Background image (20% opacity, dark gradient overlay) on the "Investigative Journalist" tile in the Talents grid.
Component: `src/components/Talents.tsx`
Alt text: "Don Matthews reporting in the field for We The People News"

## American Injustice — Book Cover
Not yet sourced/implemented. Still using text-only placeholder in `src/components/Book.tsx`.
Next step: get the actual book cover image and wire into Book.tsx the same way.
