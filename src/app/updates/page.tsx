import type { Metadata } from "next";
import { FlagshipPage, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Updates | Don Matthews",
  description: "Dated updates on American Injustice, The Record, software projects, journalism, and major flagship-site changes.",
  alternates: { canonical: "/updates" },
};

const updates = [
  {
    date: "August 22, 2026",
    category: "AMERICAN INJUSTICE",
    title: "Final prepublication source packet integrated",
    text: "A new source packet was folded into the manuscript and editorial record. The current build reports approximately 78,920 assembled words, 39 chapters, 291 pages at 6 × 9 trim, and passing source/PDF QA.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/evidence-organized/NEW_SOURCE_PACKET_2026-08-22.md",
  },
  {
    date: "August 22, 2026",
    category: "FLAGSHIP",
    title: "DonMatthews.live rebuilt as a multi-page platform",
    text: "The site moved from a giant single-page portfolio into dedicated destinations for About, Projects, Technology, American Injustice, The Record, Music, Press, Support, Contact, and Updates.",
    href: "/",
  },
  {
    date: "August 22, 2026",
    category: "THE RECORD",
    title: "Public source archive exposed through the flagship",
    text: "American Injustice and The Record now link directly to the organized public evidence repository, with visible distinctions between documented facts, attributed claims, court findings, record conflicts, and editorial notes.",
    href: "/record",
  },
  {
    date: "August 22, 2026",
    category: "INFRASTRUCTURE",
    title: "Railway dependency retired",
    text: "The flagship repository and deployment guidance were cleaned of the former Railway dependency. Vercel is the current public delivery layer while the WordPress CMS package remains prepared for a future cutover.",
    href: "/technology",
  },
  {
    date: "August 7, 2026",
    category: "SOURCE RECORD",
    title: "Sentencing allocution preserved as a source artifact",
    text: "The prepared federal allocution was transcribed into the source repository, with the editorial record distinguishing intended wording from the public delivery and from any later official transcript.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/tree/main/sentencing-2026",
  },
] as const;

export default function UpdatesPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="UPDATES" title="What changed, when, and where to inspect it." intro="A dated changelog for the book, documentary record, software portfolio, journalism work, and the flagship platform itself." />
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="relative border-l border-white/10 pl-6 sm:pl-10">
          {updates.map((update) => {
            const external = update.href.startsWith("http");
            return (
              <article key={`${update.date}-${update.title}`} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-[#c9a84c] sm:-left-[45px]" />
                <p className="text-xs font-black tracking-[0.16em] text-[#c9a84c]">{update.date} · {update.category}</p>
                <h2 className="mt-3 text-3xl font-black">{update.title}</h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-white/55">{update.text}</p>
                {external ? <a href={update.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Inspect source →</a> : <a href={update.href} className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Open update →</a>}
              </article>
            );
          })}
        </div>
      </section>
    </FlagshipPage>
  );
}
