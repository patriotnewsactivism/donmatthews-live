"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

const titles = [
  "AI Builder.",
  "Journalist.",
  "Litigator.",
  "Artist.",
  "Author."
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] pt-16"
    >
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      {/* Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Wanted Poster — decorative accent, right side on large screens */}
      <motion.div
        initial={{ opacity: 0, x: 40, rotate: 6 }}
        animate={{ opacity: 1, x: 0, rotate: 3 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="hidden lg:block absolute right-8 xl:right-20 top-1/2 -translate-y-1/2 w-[260px] xl:w-[320px] pointer-events-none z-0"
      >
        <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
          <Image
            src="/images/wanted-poster.jpg"
            alt="Wanted by the State and Federal Government for Possession of a Camera with Intent to Expose — Don Matthews, We The People News"
            width={1024}
            height={1024}
            className="w-full h-auto opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Subtle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs sm:text-sm font-medium tracking-wide mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>donmatthews.live — Portfolio & Access Hub</span>
        </motion.div>

        {/* Main Headline — Don Matthews only */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white mb-6"
        >
          Don Matthews
        </motion.h1>

        {/* Cycling Subtitle */}
        <div className="h-16 sm:h-20 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-2xl sm:text-4xl md:text-5xl font-semibold text-gold tracking-wide"
            >
              {titles[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Short Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto text-gray-400 text-base sm:text-xl leading-relaxed mb-12 font-light"
        >
          Entrepreneur, software developer, AI architect, and songwriter.
          Building the future — one line of code, one song, and one lawsuit at a time.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg shadow-lg shadow-gold/10 transition-colors duration-300"
          >
            Explore My Work
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#bundle"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all duration-300"
          >
            All-Access Bundle
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/20 text-gold-light">
              Coming Soon
            </span>
          </a>
        </motion.div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
}
