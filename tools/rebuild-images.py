#!/usr/bin/env python3
"""Regenerate the site's raster assets from their delivered originals.

Run from the repo root:  python3 tools/rebuild-images.py

The delivered `wanted-poster.jpg` was a square crop of a portrait poster, which
sliced the closing line ("WE THE PEOPLE NEWS") through the middle of its
letterforms at the bottom edge. This script cuts the sheet at the clean paper
band under "DON MATTHEWS" and rebuilds a real bottom margin from that same
paper, so the poster reads as a complete sheet at any size.
"""
from __future__ import annotations

import random
import sys
from pathlib import Path

from PIL import Image, ImageFilter

IMAGES = Path("public/images")

POSTER_CUT = 937            # clean paper band under "DON MATTHEWS" (rows 928-946)
POSTER_TILE = (929, 947)    # paper sampled for the rebuilt margin
POSTER_MARGIN = 123


def rebuild_poster(source: Path, target: Path) -> None:
    im = Image.open(source).convert("RGB")
    width, _ = im.size
    height = POSTER_CUT + POSTER_MARGIN

    tile = im.crop((0, POSTER_TILE[0], width, POSTER_TILE[1]))
    tile_h = tile.size[1]

    canvas = Image.new("RGB", (width, height))
    canvas.paste(im.crop((0, 0, width, POSTER_CUT)), (0, 0))

    # Tile the paper band downward, flipping alternate passes so the grain never
    # repeats on a period the eye can lock onto.
    y, flipped = POSTER_CUT, False
    while y < height:
        canvas.paste(tile.transpose(Image.FLIP_TOP_BOTTOM) if flipped else tile, (0, y))
        y += tile_h
        flipped = not flipped

    # Blur the synthesized margin to erase tile seams, keeping the sheet's torn
    # left and right edges sharp by pasting them back unblurred.
    margin = canvas.crop((0, POSTER_CUT - 8, width, height))
    blurred = margin.filter(ImageFilter.GaussianBlur(2.4))
    edge = 26
    blurred.paste(margin.crop((0, 0, edge, margin.size[1])), (0, 0))
    blurred.paste(margin.crop((width - edge, 0, width, margin.size[1])), (width - edge, 0))
    canvas.paste(blurred, (0, POSTER_CUT - 8))

    # Match the sheet's natural falloff and re-grain the blurred margin,
    # otherwise it reads as a flat panel taped under the poster.
    px = canvas.load()
    rnd = random.Random(7)
    start = POSTER_CUT - 8
    for y in range(start, height):
        t = (y - start) / float(height - start)
        shade = 1.0 - 0.17 * (t ** 1.7)
        for x in range(width):
            r, g, b = px[x, y]
            n = rnd.randint(-6, 6)
            px[x, y] = (
                max(0, min(255, int(r * shade) + n)),
                max(0, min(255, int(g * shade) + n)),
                max(0, min(255, int(b * shade) + n)),
            )

    canvas.save(target, "JPEG", quality=86, optimize=True, progressive=True, subsampling=1)
    print(f"wanted-poster.jpg  -> {canvas.size[0]}x{canvas.size[1]}  {target.stat().st_size // 1024} KB")


def main() -> int:
    if not IMAGES.is_dir():
        print("run this from the repository root", file=sys.stderr)
        return 1

    poster = IMAGES / "wanted-poster.jpg"
    if Image.open(poster).size == (1024, 1024):
        rebuild_poster(poster, poster)
    else:
        print("wanted-poster.jpg already rebuilt; skipping")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
