"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Music, Scale, BookOpen, Rocket, Shield } from "lucide-react";

const stats = [
  { icon: <Code className="w-5 h-5" />, value: "100+", label: "Apps Built" },
  { icon: <Music className="w-5 h-5" />, value: "17", label: "Album Tracks" },
  { icon: <Scale className="w-5 h-5" />, value: "1", label: "Federal Lawsuit" },
  { icon: <BookOpen className="w-5 h-5" />, value: "1", label: "Book Coming Soon" },
  { icon: <Rocket className="w-5 h-5" />, value: "8+", label: "Live Platforms" },
  { icon: <Shield className="w-5 h-5" />, value: "∞", label: "Fights Left" },
];

export default function StatsBar() {
  return (
    <section className="relative py-16 bg-[#0a0a0a] border-y border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="text-gold/60 mb-1">{stat.icon}</div>
              <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
