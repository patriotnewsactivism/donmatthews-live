import type { Metadata } from "next";
import { FlagshipPage, GoldButton, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "American Injustice | Don Matthews",
  description: "American Injustice is Don Matthews' nonfiction legal-thriller memoir and documentary record project.",
  alternates: { canonical: "/american-injustice" },
};

const sections = [
  ["The Book", "A first-person nonfiction legal-thriller memoir built around court records, recordings, public documents, chronology, and lived experience."],
  ["The Source Record", "The long-form project is designed to separate narrative from documentation: filings, transcripts, recordings, exhibits, and source material can be linked and examined independently."],
  ["The Timeline", "A structured chronology turns years of events into a navigable record rather than forcing readers to reconstruct the sequence from scattered documents."],
  ["Updates", "Release notes, corrections, new source material, excerpts, and publication updates will live here as the project develops."],
];

export default function AmericanInjusticePage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="AMERICAN INJUSTICE" title="The story. The record behind it. Both matter." intro="A nonfiction legal-thriller memoir and documentary project organized so readers can follow the narrative while also examining the underlying record." actions={<><GoldButton href="https://help.donmatthews.live">Explore the Current Story</GoldButton><OutlineButton href="/record">Open The Record</OutlineButton></>} />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map(([title, text]) => <div key={title} className="rounded-xl border border-white/10 bg-white/[0.025] p-7"><h2 className="text-2xl font-bold">{title}</h2><p className="mt-4 leading-8 text-white/55">{text}</p></div>)}
        </div>
        <div className="mt-14 rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.05] p-8">
          <p className="text-xs font-black tracking-[0.18em] text-[#c9a84c]">EDITORIAL PRINCIPLE</p>
          <p className="mt-4 max-w-4xl text-xl leading-9 text-white/70">Claims about disputed events should be presented with attribution and source material. The site architecture is being built to make that distinction visible instead of blurring allegation, evidence, commentary, and adjudicated fact together.</p>
        </div>
      </section>
    </FlagshipPage>
  );
}
