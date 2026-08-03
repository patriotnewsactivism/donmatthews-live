"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Who is Don Matthews?",
    a: "Don Matthews is an entrepreneur, AI systems architect, investigative journalist, civil rights litigator, and songwriter. He's built 100+ apps, directs We The People News, is pursuing federal civil rights litigation (Reardon v. Osteen, S.D. Texas), and produces documentary music under the Bad Actors project.",
  },
  {
    q: "What is the All-Access Bundle?",
    a: "The All-Access Bundle is an upcoming subscription that gives you VIP access to ChatScream, CodeForge, and TubeScribe — plus free music downloads and a free copy of the American Injustice book — for one flat monthly or annual fee. Join the waitlist to lock in early pricing.",
  },
  {
    q: "Can I download the Bad Actors album for free?",
    a: "Yes. All 17 tracks from Bad Actors Volume 1 are available as a free download. Enter your email in the Music section and you'll get a direct download link. No spam, just the album.",
  },
  {
    q: "What is Reardon v. Osteen?",
    a: "Reardon v. Osteen is a federal civil rights lawsuit filed in the Southern District of Texas under 42 U.S.C. § 1983. The case alleges constitutional violations including false arrest, fabrication of evidence, and judicial misconduct. Don Matthews is the pro se plaintiff.",
  },
  {
    q: "How do I contact Don Matthews for media or bookings?",
    a: "For press inquiries, podcast bookings, expert commentary, or licensing questions, email press@wtpnews.org. For general inquiries, use patriotnewsactivism@gmail.com.",
  },
  {
    q: "What software products does Don Matthews build?",
    a: "Current live products include BuildMyBot.App (AI workforce deployment), CaseBuddy (legal research), ChatScream (AI chat platform), TubeScribe (YouTube transcription), and We The People News. CodeForge (AI dev tools) and APEX (autonomous AI framework) are in development.",
  },
  {
    q: "When is the American Injustice book coming out?",
    a: "The book is coming soon on Amazon. Sign up for notifications in the Book section to get updates on the release date, sneak peeks, and early access offers.",
  },
  {
    q: "Is the music available on Spotify or Apple Music?",
    a: "Not yet — Spotify and Apple Music distribution is coming soon. In the meantime, you can listen on BandLab, Suno AI, or download the full album for free directly from this site.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute right-1/4 top-10 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Frequently Asked
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 font-light">
            Quick answers to the most common questions about Don, his projects, and the bundle.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-gold/20 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-gold" : "text-white"}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-gold/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed font-light border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
