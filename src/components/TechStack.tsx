"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

const categories = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "HTML/CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Python", "Express", "FastAPI", "REST APIs", "GraphQL"],
  },
  {
    title: "AI & Data",
    items: ["OpenAI", "Anthropic", "LangChain", "Supabase", "PostgreSQL", "Vector DBs"],
  },
  {
    title: "Infrastructure",
    items: ["Vercel", "WordPress", "Docker", "GitHub Actions", "AWS", "Cloudflare"],
  },
  {
    title: "Creative",
    items: ["Suno AI", "BandLab", "Audio Production", "Video Editing", "Figma", "Canva"],
  },
  {
    title: "Legal",
    items: ["§ 1983 Litigation", "FOIA Requests", "First Amendment Audits", "Federal Courts", "Case Research", "Legal Writing"],
  },
];

export default function TechStack() {
  return (
    <section id="stack" className="py-24 relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <Cpu className="w-4 h-4" />
            <span>Tools of the Trade</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Built With the Best
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 font-light">
            From AI pipelines to federal court filings — the technologies and disciplines that power everything.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-gold/20 transition-all duration-300"
            >
              <h3 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">{cat.title}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-gray-300 font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
