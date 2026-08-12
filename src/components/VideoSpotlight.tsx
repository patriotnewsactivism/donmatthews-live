"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";

// Add new videos here — Facebook's plugin iframe accepts either a canonical
// video/reel URL or a /share/v/... share link directly as `href`, no need
// to resolve it first. Reels render portrait — no responsive embed option,
// so each wrapper is capped at its own width/height and centered.
//
// NOTE 2026-08-12: the ORIGINAL featured reel (3359834177517605, the
// cowboy-hat clip) had previously shown "Video Unavailable" in a live
// browser check and was pulled — re-tested today and it renders fine again
// (Facebook reels/share-links flap between available/unavailable
// unpredictably; this is NOT the durable fix, just today's status). Restored
// it as the hero/most-prominent video per Don, above the other two. If this
// one goes dark again, the durable fix is self-hosting: upload the actual
// video file to public/videos/ so it's immune to Facebook link rot.
const heroVideo = {
  href: "https://www.facebook.com/reel/3359834177517605/",
  title: "Featured video — hero",
  width: 380,
  height: 677,
  showText: false,
};

const videos = [
  {
    href: "https://www.facebook.com/reel/2102941800271906/",
    title: "Featured video",
    width: 267,
    height: 476,
    showText: false,
  },
  {
    href: "https://www.facebook.com/reel/1025978140247388/",
    title: "Sentencing hearing — allocution speech",
    width: 476,
    // Bumped from 591 -> 700 so the like/comment/share stats row under the
    // caption isn't clipped (was cut off at the bottom on mobile).
    height: 700,
    showText: true,
  },
];

function VideoFrame({ v }: { v: typeof heroVideo }) {
  return (
    <iframe
      src={`https://www.facebook.com/plugins/video.php?height=${v.height}&href=${encodeURIComponent(
        v.href
      )}&show_text=${v.showText}&width=${v.width}&t=0`}
      width={v.width}
      height={v.height}
      style={{ border: "none", overflow: "hidden", display: "block", maxWidth: "100%" }}
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      title={v.title}
    />
  );
}

export default function VideoSpotlight() {
  return (
    <section id="video" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute left-1/4 top-10 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
          <Video className="w-4 h-4" />
          <span>Featured Video</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Watch
        </h2>
        <div className="w-20 h-1 bg-gold mx-auto rounded mb-10" />

        {/* Hero video — most prominent, on top, alone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border-2 border-gold shadow-[0_0_40px_-10px_rgba(212,175,55,0.4)] overflow-hidden bg-[#151515] mx-auto mb-8"
          style={{ width: heroVideo.width, maxWidth: "100%" }}
        >
          <VideoFrame v={heroVideo} />
        </motion.div>

        {/* Secondary videos, below the hero */}
        <div className="flex flex-wrap justify-center items-start gap-8">
          {videos.map((v) => (
            <motion.div
              key={v.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border-2 border-gold/30 shadow-2xl overflow-hidden bg-[#151515]"
              style={{ width: v.width, maxWidth: "100%" }}
            >
              {/* Kept in-page per standing rule — never link out to open the video elsewhere. */}
              <VideoFrame v={v} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
