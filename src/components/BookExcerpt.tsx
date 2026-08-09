"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

// Real prologue text from American Injustice (full-rewrite/00_prologue.md),
// trimmed to a sampling -- not the whole chapter. Keep in sync if the
// manuscript's opening is revised.
export default function BookExcerpt() {
  return (
    <section id="excerpt" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute right-1/4 top-1/3 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <BookOpen className="w-4 h-4" />
            <span>From the Book</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            A Sample of American Injustice
          </h2>
          <p className="text-gray-500 text-sm mt-3 font-mono uppercase tracking-wider">
            Prologue &mdash; The First Domino
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8 sm:p-12 space-y-6"
        >
          <p className="text-xl sm:text-2xl text-white font-light leading-relaxed italic">
            &ldquo;The video is eleven seconds long, and it is the only ten years of the
            rest of my life needed to turn on.&rdquo;
          </p>

          <p className="text-gray-300 font-light leading-relaxed">
            I stand on a public sidewalk in Oxford, Mississippi, holding a video camera
            at chest height, the way people hold cameras when they have already learned
            that lowering the camera is the first thing an officer will ask for. I am
            not shouting. I am not blocking a door. I am filming a public building from
            a public sidewalk, which is a thing the Constitution of the United States
            says I am allowed to do &mdash; and which, on this particular afternoon, is
            about to get me arrested anyway.
          </p>

          <p className="text-gray-300 font-light leading-relaxed">
            Here is what is true, and provably so, independent of anything I say about
            myself: on May 20, 2017, I bought a rifle. There is a bill of sale. Six days
            later, four senior law enforcement officers arrived to arrest me for
            threatening a local couple with that same rifle &mdash; on an allegation
            dated twelve days before the rifle existed. That is not a matter of my word
            against the state's. That is a receipt against a police report, and the
            receipt wins.
          </p>

          <p className="text-gray-400 font-light leading-relaxed text-sm border-l-2 border-gold/40 pl-4">
            Both a difficult man and a genuine cover-up can be true at once. That tension
            isn't resolved here by picking a side &mdash; it's resolved by refusing to
            pretend the tension isn't there. Two honest ledgers, kept open at once.
          </p>

          <div className="pt-4 flex justify-center">
            <a
              href="https://help.donmatthews.live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg transition-colors duration-300"
            >
              Read the Full Story
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
