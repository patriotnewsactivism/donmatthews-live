"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

// Prologue text from American Injustice (full-rewrite/00_prologue.md), trimmed to a
// sample -- not the whole chapter. Updated 2026-08-18 after the prologue was rewritten
// to open at Camp Devil Dog. Keep in sync if the manuscript's opening changes again.
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
            &ldquo;Nobody writes a policy change like that in response to a &lsquo;training
            accident.&rsquo; You write it in response to a suicide you don&rsquo;t want to
            happen again.&rdquo;
          </p>

          <p className="text-gray-300 font-light leading-relaxed">
            Before Oxford. Before the flag. Before any of the names in this book had reason
            to know mine, there was Parris Island. I graduated a Marine at the end of March
            2008. I was proud of it. I am still proud of it. Nothing that follows in this
            book changes that.
          </p>

          <p className="text-gray-300 font-light leading-relaxed">
            The Marine assigned to Armory Watch that night was Private First Class Bradley
            Foust. I did not know him. I want to be exact about that, because it would be
            easy to write this the other way &mdash; to make him a friend, to give the night
            a closeness it did not have &mdash; and it would be a lie on the first page of a
            book about lies in the record.
          </p>

          <p className="text-gray-300 font-light leading-relaxed">
            By the time the paperwork was finished, it said &ldquo;training accident.&rdquo;
            A suicide could mean a family loses death benefits; a training accident preserves
            them. But in choosing that label, the Marine Corps didn&rsquo;t just spare a
            family a hard conversation. It rewrote what had happened, in the actual permanent
            record, before Foust&rsquo;s body had even been removed from the armory.
          </p>

          <p className="text-gray-300 font-light leading-relaxed">
            Nine years later I filed a FOIA request with the Marine Corps. Buried in the
            pages they sent back was a quiet, unadvertised change to the Corps&rsquo; own
            standard operating procedures &mdash; made that same month, in May 2008,
            disallowing live ammunition at Armory Watch posts going forward. The document
            didn&rsquo;t say the word. It didn&rsquo;t have to. The policy change was the
            institution telling on itself.
          </p>

          <p className="text-gray-400 font-light leading-relaxed text-sm border-l-2 border-gold/40 pl-4">
            His death &mdash; sanitized, reframed, filed away as an accident by an institution
            that knew better &mdash; is the first time I watched official truth and actual
            truth get separated on purpose, and it would not be the last. This book, in more
            ways than one, is the record he was denied.
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
