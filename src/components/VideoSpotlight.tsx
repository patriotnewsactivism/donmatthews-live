"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";

// Add new videos here — Facebook's plugin iframe accepts either a canonical
// video/reel URL or a /share/v/... share link directly as `href`, no need
// to resolve it first. Fixed-size 476x476 per Facebook's plugin (no
// responsive embed option), so we cap the wrapper at that width and center.
//
// NOTE 2026-08-09: the second video that used to live here
// (facebook.com/share/v/1C8kc2L4tx/, "Music video") is confirmed dead --
// Facebook's own plugin returns "Video Unavailable: this video may no
// longer exist, or you don't have permission to view it." This is the
// SECOND time a share link for this same video has died (see git blame:
// it was already replaced once before, commit 76a32eb). Share links are
// fragile -- they rot if the source post is deleted/reposted/set private.
// Removed rather than shipping a broken embed. To bring this back: get a
// fresh public reel/video URL (not a /share/ link if avoidable), or better,
// have Don upload the actual video file to public/videos/ so it's
// self-hosted and immune to Facebook link rot.
const videos = [
  {
    href: "https://www.facebook.com/reel/3359834177517605/",
    title: "Featured video",
  },
];

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

        <div className="flex flex-wrap justify-center gap-8">
          {videos.map((v) => (
            <motion.div
              key={v.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[476px] rounded-2xl border-2 border-gold/30 shadow-2xl overflow-hidden bg-[#151515]"
            >
              {/* Kept in-page per standing rule — never link out to open the video elsewhere. */}
              <iframe
                src={`https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(
                  v.href
                )}&show_text=false&width=476&t=0`}
                width="476"
                height="476"
                style={{ border: "none", overflow: "hidden", display: "block", maxWidth: "100%" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={v.title}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
