import type { Metadata } from "next";
import Image from "next/image";
import { FlagshipPage, GoldButton, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "About Don Matthews | Journalist, Builder, Author & Artist",
  description: "About Don Matthews: investigative journalist, AI builder, author, songwriter, and creator of independent media and software projects.",
  alternates: { canonical: "/about" },
};

const lanes = [
  ["Journalism", "Independent reporting centered on government accountability, public records, civil rights, and the work of We The People News."],
  ["Technology", "AI systems, software products, autonomous-agent architecture, and practical tools designed to do useful work."],
  ["American Injustice", "A nonfiction legal-thriller memoir and documentary project built around records, recordings, chronology, and lived experience."],
  ["Music", "Documentary-style songwriting and production that turns public-record themes, conflict, and accountability into narrative music."],
];

export default function AboutPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="ABOUT" title="One body of work. Several disciplines." intro="Don Matthews works across investigative journalism, software and AI, nonfiction writing, civil-rights advocacy, and documentary music—with each lane feeding the others." actions={<><GoldButton href="/projects">Explore Projects</GoldButton><OutlineButton href="/press">Press & Media</OutlineButton></>} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <Image src="/images/portrait-bw.jpg" alt="Don Matthews" width={960} height={960} className="w-full max-w-md rounded-xl border border-white/10 grayscale shadow-2xl shadow-black/50" />
        <div>
          <p className="text-xl leading-9 text-white/70">The through-line is independence: build the platform, inspect the record, publish the reporting, make the argument, and create the work without waiting for a gatekeeper to do it first.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {lanes.map(([title, text]) => <div key={title} className="rounded-xl border border-white/10 bg-white/[0.025] p-6"><h2 className="text-xl font-bold">{title}</h2><p className="mt-3 leading-7 text-white/50">{text}</p></div>)}
          </div>
        </div>
      </section>
    </FlagshipPage>
  );
}
