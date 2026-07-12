"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code, Eye, ShieldCheck, Scale, Music, Leaf, BookOpen } from "lucide-react";

interface Talent {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const talents: Talent[] = [
  {
    title: "Software Developer & AI Architect",
    description: "100+ apps built. Full-stack TypeScript, AI integration, SaaS architecture.",
    icon: <Code className="w-6 h-6 text-gold" />,
  },
  {
    title: "Investigative Journalist",
    description: "Director of We The People News. First Amendment audits, FOIA requests, government accountability.",
    icon: <Eye className="w-6 h-6 text-gold" />,
  },
  {
    title: "Civil Rights Litigator",
    description: "Pro se plaintiff. Reardon v. Osteen (S.D. Texas). Fighting § 1983 violations head-on.",
    icon: <Scale className="w-6 h-6 text-gold" />,
  },
  {
    title: "First Amendment Activist",
    description: "Defending free press and speech rights at every level.",
    icon: <ShieldCheck className="w-6 h-6 text-gold" />,
  },
  {
    title: "Songwriter & Music Producer",
    description: "Bad Actors — documentary music project exposing corruption through song.",
    icon: <Music className="w-6 h-6 text-gold" />,
  },
  {
    title: "Marijuana Rights Activist",
    description: "Advocating for full decriminalization and removal of cannabis laws nationwide.",
    icon: <Leaf className="w-6 h-6 text-gold" />,
  },
  {
    title: "Author",
    description: "American Injustice — coming soon. A firsthand account of constitutional violations.",
    icon: <BookOpen className="w-6 h-6 text-gold" />,
  },
];

export default function Talents() {
  return (
    <section id="talents" className="py-24 relative bg-[#0a0a0a]">
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Multidisciplinary Talents
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded mb-4" />
          <p className="max-w-2xl mx-auto text-gray-400 font-light">
            Defending civil liberties, creating technology systems, and composing documentary-style music.
          </p>
        </div>

        {/* 7 tiles layout: 3 cols layout transitioning seamlessly */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent, idx) => (
            <motion.div
              key={talent.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`flex flex-col p-8 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.01] to-transparent hover:border-gold/20 hover:from-white/[0.03] transition-all duration-300 ${
                idx === 6 ? "md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none lg:mx-0 w-full" : ""
              }`}
            >
              <div className="p-3 bg-gold/10 rounded-lg w-fit mb-6">
                {talent.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-wide">
                {talent.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                {talent.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
