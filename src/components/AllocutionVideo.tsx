"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The sentencing-hearing allocution reel.
 *
 * Carried over from the retired `VideoSpotlight` section, which stopped
 * rendering when the flagship redesign replaced the old homepage and left that
 * component unreferenced by any route.
 *
 * Two things this does differently from the old embed:
 *
 * 1. Click-to-load. The Facebook plugin iframe pulls in third-party script and
 *    cookies on every page view and was the heaviest thing on the homepage. The
 *    facade below costs nothing until someone actually presses play.
 * 2. It measures its container instead of hard-coding a pixel width. The FB
 *    plugin renders at exactly the `width` it is handed and does not reflow, so
 *    the old fixed 476px embed overflowed narrow phones.
 *
 * Facebook reels flap between available and unavailable without warning, so the
 * card always carries a direct link out as a fallback. If it goes dark for good,
 * the durable fix is self-hosting the file under `public/videos/`.
 */

const VIDEO_HREF = "https://www.facebook.com/reel/1025978140247388/";
const MAX_WIDTH = 420;
/** Reels are portrait 9:16; the plugin letterboxes anything that is not. */
const ASPECT = 16 / 9;

export default function AllocutionVideo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [width, setWidth] = useState(MAX_WIDTH);

  const measure = useCallback(() => {
    const element = frameRef.current;
    if (!element) return;
    setWidth(Math.max(240, Math.min(MAX_WIDTH, Math.floor(element.clientWidth))));
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [measure]);

  const height = Math.round(width * ASPECT);
  const src =
    `https://www.facebook.com/plugins/video.php?height=${height}` +
    `&href=${encodeURIComponent(VIDEO_HREF)}&show_text=false&width=${width}&t=0`;

  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-[#0b0b0a]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_28%,rgba(201,168,76,0.12),transparent_38%)]" />

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[1fr_.72fr] lg:items-center lg:gap-14">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#c9a84c]" />
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d6b85a] sm:text-xs">
              On the record · On camera
            </p>
          </div>
          <h2 className="display-serif mt-5 text-3xl font-semibold leading-[1.04] text-[#f2ead8] sm:text-5xl">
            The allocution speech.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">
            Delivered at the federal sentencing hearing and published in full. No edit, no summary — the statement as
            it was made, alongside the filings and the rest of the documentary record.
          </p>
          <a href="/record" className="mt-7 inline-block font-bold text-[#c9a84c] transition hover:text-[#e2c66d]">
            Open The Record →
          </a>
        </div>

        <div className="mx-auto w-full max-w-[420px]">
          <div
            ref={frameRef}
            className="relative overflow-hidden rounded-2xl border border-[#c9a84c]/30 bg-[#050504] shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
            style={{ aspectRatio: playing ? undefined : "9 / 16" }}
          >
            {playing ? (
              <iframe
                src={src}
                width={width}
                height={height}
                className="block w-full"
                style={{ border: "none", overflow: "hidden", height }}
                scrolling="no"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Sentencing hearing — allocution speech"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.1),transparent_68%)] px-6 text-center transition hover:bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.17),transparent_68%)]"
              >
                <span className="grid h-20 w-20 place-items-center rounded-full border border-[#c9a84c]/50 bg-[#c9a84c]/10 transition group-hover:scale-105 group-hover:border-[#c9a84c] group-hover:bg-[#c9a84c]/20">
                  <svg viewBox="0 0 24 24" aria-hidden className="ml-1 h-8 w-8 fill-[#d9bd65]">
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
                <span>
                  <span className="display-serif block text-xl font-semibold text-[#f2ead8]">Sentencing hearing</span>
                  <span className="mt-2 block text-[10px] font-black uppercase tracking-[0.2em] text-[#c9a84c]">
                    Allocution · full statement
                  </span>
                </span>
                <span className="text-xs text-white/32">Press play to load the video</span>
              </button>
            )}
          </div>

          <p className="mt-3 text-center text-[11px] text-white/30">
            Hosted on Facebook.{" "}
            <a
              href={VIDEO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/20 underline-offset-2 transition hover:text-white/60"
            >
              Open it there
            </a>{" "}
            if the embed does not load.
          </p>
        </div>
      </div>
    </section>
  );
}
