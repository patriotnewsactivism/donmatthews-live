"use client";

import React from "react";
import { motion } from "framer-motion";
import { Video } from "lucide-react";

export default function VideoSpotlight() {
  return (
    <section id="video" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute left-1/4 top-10 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
          <Video className="w-4 h-4" />
          <span>Featured Video</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Watch
        </h2>
        <div className="w-20 h-1 bg-gold mx-auto rounded mb-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-[476px] rounded-2xl border-2 border-gold/30 shadow-2xl overflow-hidden bg-[#151515]"
        >
          {/* Facebook's plugin iframe is fixed-size (no responsive embed
              option from Facebook), so we cap the wrapper at its native
              476px and let it center. Kept in-page per standing rule —
              never link out to open the video elsewhere. */}
          <iframe
            src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F3359834177517605%2F&show_text=false&width=476&t=0"
            width="476"
            height="476"
            style={{ border: "none", overflow: "hidden", display: "block", maxWidth: "100%" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Featured video"
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
