# donmatthews.live — Image Assets

## Wanted poster
File: `public/images/wanted-poster.jpg` — **1024 × 1060**
Usage: homepage hero (`src/app/page.tsx`).

> The delivered file was a 1024 × 1024 crop of a portrait poster and cut the
> artwork at both ends: "WE THE PEOPLE NEWS" was sliced through the middle of
> its letterforms at the bottom edge, and the tops of "WANTED" are trimmed flat.
> `tools/rebuild-images.py` cuts the sheet at the clean paper band under "DON
> MATTHEWS" and rebuilds a real bottom margin from that same paper, so the sheet
> reads as complete. The trimmed headline is in the pixels and cannot be
> recovered from this file.
>
> **Re-exporting the poster at its full bleed would restore both lines** — drop
> the new file in and re-run the script.

## American Injustice — front cover
File: `public/images/american-injustice-cover.jpg` — 1025 × 1536
Usage: portrait cover, shown below `lg` on the homepage book section and on
`/american-injustice`.

## American Injustice — desktop campaign art
File: `public/images/american-injustice-desktop.jpg` — 1536 × 864
Usage: full-bleed hero background on `lg` and up for the same two sections, and
the Open Graph / Twitter card image for `/american-injustice`.

## American Injustice — cover (SVG)
File: `public/images/american-injustice-cover.svg`
Currently unreferenced by any route.

## Portrait — B&W
File: `public/images/portrait-bw.jpg` — 960 × 960
Usage: About and Press. Also the Open Graph and `schema.org/Person` image in
`src/app/layout.tsx`.

## Bad Actors — album cover
File: `public/images/bad-actors-cover.jpg` — 1024 × 1024
Usage: homepage music section and `/music`.

## Field photo — journalism
File: `public/images/field-journalist.jpg` — 1024 × 494
Currently unused; it was wired into `src/components/Talents.tsx`, which is no
longer rendered by any route.

## Happy Fuck The Cops Day — single cover
File: `public/images/happy-fuck-the-cops-day-cover.jpg` — 1024 × 1024
Currently unused; referenced only by `src/components/SingleReleasePromo.tsx`,
which is no longer rendered by any route.

## Article thumbnails
Remote, from the WordPress feed (`getPostImage`). They 404 and hotlink-block
often enough that `ArticleMedia` renders a branded fallback on error.

---

**Keep `width`/`height` matching the real file.** The browser reserves an
aspect-ratio box from those attributes, so a wrong value jumps the layout while
the image loads — the poster was declared 900×1200, then 1024×1536, for a file
that was neither.
