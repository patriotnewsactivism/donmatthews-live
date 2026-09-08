"use client";

/**
 * "Caught Red Handed" — Bad Actors music video.
 *
 * Self-hosted per the standing durable-fix note on the Facebook embeds
 * elsewhere on this site (see AllocutionVideo.tsx / VideoSpotlight.tsx):
 * third-party video links rot, native <video> does not. Playback stays
 * entirely in-page — no navigating away, per standing rule.
 */

const VIDEO_SRC =
  "https://base44.app/api/apps/6a989933e9ce9588d8c0e8a7/files/mp/public/6a989933e9ce9588d8c0e8a7/01e02f0a2_0d253d827_EPICNewMusicVideoReleaseCaughtRedHandeddropsthehammeronMulti-StateConspiracy.mp4";
const POSTER_SRC =
  "https://base44.app/api/apps/6a989933e9ce9588d8c0e8a7/files/mp/public/6a989933e9ce9588d8c0e8a7/654ef940b_caught-red-handed-poster.jpg";

export default function CaughtRedHandedVideo() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/10 bg-[#0a0a0a]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(201,168,76,0.1),transparent_38%)]" />

      <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-[#c9a84c]" />
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d6b85a] sm:text-xs">
            New release · Bad Actors
          </p>
        </div>
        <h2 className="display-serif mt-5 text-3xl font-semibold leading-[1.04] text-[#f2ead8] sm:text-5xl">
          Caught Red Handed
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
          The official music video — dropping the hammer on a multi-state conspiracy.
        </p>

        <div
          className="mt-9 overflow-hidden rounded-2xl border border-[#c9a84c]/25 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
          style={{ width: "min(100%, 960px)", margin: "0 auto" }}
        >
          <video
            controls
            preload="none"
            poster={POSTER_SRC}
            playsInline
            className="block h-auto w-full"
            style={{ aspectRatio: "16 / 9" }}
            title="Caught Red Handed — Bad Actors"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
            Your browser does not support embedded video.
          </video>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
          <span>Bad Actors · Volume 1</span>
          <a href="/music" className="text-[#c9a84c] transition hover:text-[#e2c66d]">
            Hear the full album →
          </a>
        </div>
      </div>
    </section>
  );
}
