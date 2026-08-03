"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Don's ability to bridge the gap between cutting-edge AI technology and real-world civil rights advocacy is unlike anything I've seen. He doesn't just build tools — he builds weapons for justice.",
    name: "We The People News",
    role: "Independent Newsroom",
  },
  {
    quote: "The Bad Actors album hits different because every track is backed by court documents, evidence, and real consequences. This isn't just music — it's a documentary you can listen to.",
    name: "Bad Actors Project",
    role: "Documentary Music",
  },
  {
    quote: "100+ apps, a federal lawsuit, a book, and a music album — all while fighting for press freedom and cannabis rights. Don Matthews is what happens when you refuse to pick just one lane.",
    name: "The Portfolio",
    role: "Body of Work",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0c0c0c]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute left-1/3 bottom-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <Quote className="w-4 h-4" />
            <span>What People Say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            In Their Words
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-8 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold/20 transition-all duration-300 flex flex-col"
            >
              <div className="text-gold/30 mb-4">
                <Quote className="w-8 h-8" />
              </div>
              <p className="text-gray-300 font-light leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
