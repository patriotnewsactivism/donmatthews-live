"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Layers, ArrowUpRight } from "lucide-react";

interface Project {
  name: string;
  description: string;
  status: "LIVE" | "IN DEVELOPMENT" | "BETA";
  link?: string;
}

const projects: Project[] = [
  {
    name: "BuildMyBot.App",
    description: "AI agency in a box. Deploy your own AI workforce in minutes.",
    status: "LIVE",
    link: "https://buildmybot.app",
  },
  {
    name: "CaseBuddy",
    description: "AI-powered legal research and case management.",
    status: "LIVE",
    link: "https://casebuddy.live",
  },
  {
    name: "We The People News",
    description: "Independent investigative journalism. Government accountability, unfiltered.",
    status: "LIVE",
    link: "https://wtpnews.org",
  },
  {
    name: "Civil Rights Hub",
    description: "Legal resources and advocacy for civil rights violations.",
    status: "LIVE",
    link: "https://civilrightshub.org",
  },
  {
    name: "ChatScream",
    description: "AI-powered real-time chat platform.",
    status: "LIVE",
    link: "https://chatscream.live",
  },
  {
    name: "CodeForge",
    description: "AI developer tools for modern engineering teams.",
    status: "IN DEVELOPMENT",
  },
  {
    name: "TubeScribe",
    description: "YouTube video transcription and AI summarization.",
    status: "BETA",
    link: "https://tubescribe.donmatthews.live",
  },
  {
    name: "APEX",
    description: "Autonomous AI workforce framework. Multi-agent orchestration at scale.",
    status: "IN DEVELOPMENT",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[#0c0c0c]">
      {/* Subtle details */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
              <Layers className="w-4 h-4" />
              <span>SaaS & Code Platforms</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Featured Ventures
            </h2>
          </div>
          <p className="max-w-md text-gray-400 font-light">
            An ecosystem of high-impact platforms empowering teams, automating workforces, and unlocking freedom.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, idx) => {
            const isLive = project.status === "LIVE";
            const isBeta = project.status === "BETA";
            const CardWrapper = project.link ? "a" : "div";

            return (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <CardWrapper
                  href={project.link}
                  target={project.link ? "_blank" : undefined}
                  rel={project.link ? "noopener noreferrer" : undefined}
                  className={`group relative flex flex-col justify-between h-full p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:border-gold/30 ${
                    project.link ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div>
                    {/* Top line */}
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded ${
                          isLive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : isBeta
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-white/10 text-gray-400"
                        }`}
                      >
                        {project.status}
                      </span>
                      {project.link && (
                        <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                      {project.description}
                    </p>
                  </div>

                  {project.link && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:text-white transition-colors mt-auto pt-4 border-t border-white/5">
                      <span>Visit Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  )}
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
