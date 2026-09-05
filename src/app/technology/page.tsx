import type { Metadata } from "next";
import { FlagshipPage, GoldButton, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Technology & AI | Don Matthews",
  description: "AI systems, autonomous agents, legal technology, media tools, and software platforms built by Don Matthews.",
  alternates: { canonical: "/technology" },
};

const systems = [
  {
    name: "APEX",
    type: "AUTONOMOUS AI WORKFORCE",
    text: "A multi-agent framework focused on autonomous sourcing, orchestration, campaign execution, and eventually broader business operations.",
    href: "/projects",
  },
  {
    name: "ARIA",
    type: "AI COWORKER",
    text: "An agent concept combining memory, workflows, a working shell, and an operator-facing dashboard.",
    href: "/projects",
  },
  {
    name: "ChatScream",
    type: "COMMUNICATION & STREAMING",
    text: "A real-time communication and streaming platform with AI-assisted workflows around live media and audience interaction.",
    href: "https://chatscream.live",
  },
  {
    name: "TubeScribe",
    type: "MEDIA INTELLIGENCE",
    text: "Video transcription and AI-assisted media analysis for turning long-form video into searchable, reusable information.",
    href: "https://tubescribe.donmatthews.live",
  },
] as const;

const principles = [
  ["Durable data", "Production systems should retain leads, records, and operational state in durable storage—not temporary files that disappear on restart."],
  ["Agent orchestration", "The useful unit is increasingly a coordinated workforce of specialized agents rather than a single chatbot."],
  ["Human-readable operations", "Dashboards, source trails, logs, and clear system state matter because autonomous software still needs accountable operation."],
  ["Real-world outputs", "The target is not an AI demo. The target is completed work: qualified leads, research, media processing, case organization, publishing, and business operations."],
] as const;

export default function TechnologyPage() {
  return (
    <FlagshipPage>
      <PageHero
        eyebrow="TECHNOLOGY & AI"
        title="AI systems built to do work, not just talk about it."
        intro="A portfolio of autonomous-agent systems, legal technology, media tools, and production software aimed at turning AI into an operating layer for real workflows."
        actions={<><GoldButton href="/projects">All Projects</GoldButton><OutlineButton href="/projects">Explore the Systems</OutlineButton></>}
      />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">SYSTEMS</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">From AI coworker to autonomous workforce.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {systems.map((system) => {
            const external = system.href.startsWith("http");
            const className = "group rounded-xl border border-white/10 bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-[#c9a84c]/35";
            const body = <><p className="text-xs font-black tracking-[0.16em] text-[#c9a84c]">{system.type}</p><h3 className="mt-3 text-2xl font-bold">{system.name}</h3><p className="mt-4 leading-8 text-white/50">{system.text}</p><span className="mt-6 inline-block text-sm font-bold text-[#c9a84c]">Explore →</span></>;
            return external ? <a key={system.name} href={system.href} target="_blank" rel="noopener noreferrer" className={className}>{body}</a> : <a key={system.name} href={system.href} className={className}>{body}</a>;
          })}
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">BUILD PRINCIPLES</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">What production-ready means here.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {principles.map(([title, text]) => <div key={title} className="rounded-xl border border-white/10 bg-black/25 p-7"><h3 className="text-2xl font-bold">{title}</h3><p className="mt-4 leading-8 text-white/50">{text}</p></div>)}
          </div>
        </div>
      </section>
    </FlagshipPage>
  );
}
