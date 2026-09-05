import type { Metadata } from "next";
import { FlagshipPage, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Projects | Don Matthews",
  description: "Software, AI, journalism, legal-tech, media, and civil-rights projects built by Don Matthews.",
  alternates: { canonical: "/projects" },
};

const projects = [
  ["We The People News", "LIVE", "Independent investigative journalism and government accountability.", "https://wtpnews.org"],
  ["Civil Rights Hub", "LIVE", "Legal resources and advocacy tools for civil-rights issues.", "https://civilrightshub.org"],
  ["ChatScream", "LIVE", "AI-powered real-time communication and streaming platform.", "https://chatscream.live"],
  ["TubeScribe", "BETA", "YouTube transcription and AI-assisted media analysis.", "https://tubescribe.donmatthews.live"],
  ["CodeForge", "IN DEVELOPMENT", "AI developer tools for modern engineering teams.", ""],
  ["ARIA", "IN DEVELOPMENT", "AI coworker with dashboard, shell, memory, and workflows.", ""],
  ["APEX", "IN DEVELOPMENT", "Autonomous AI workforce framework for multi-agent orchestration at scale.", ""],
] as const;

export default function ProjectsPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="PROJECTS" title="Software, AI, media, and tools built to work." intro="A growing portfolio spanning autonomous AI systems, legal technology, journalism, streaming, transcription, and civil-rights resources." />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map(([name, status, description, href]) => {
            const body = <><div className="flex items-start justify-between gap-4"><h2 className="text-2xl font-bold">{name}</h2><span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#c9a84c]">{status}</span></div><p className="mt-4 leading-7 text-white/50">{description}</p>{href ? <span className="mt-8 inline-block text-sm font-bold text-[#c9a84c]">Visit project →</span> : <span className="mt-8 inline-block text-sm font-bold text-white/30">More soon</span>}</>;
            return href ? <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-[#c9a84c]/35">{body}</a> : <div key={name} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">{body}</div>;
          })}
        </div>
      </section>
    </FlagshipPage>
  );
}
