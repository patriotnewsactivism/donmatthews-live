import type { Metadata } from "next";
import { FlagshipPage, GoldButton, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "American Injustice | Don Matthews",
  description: "American Injustice is Don Matthews' 39-chapter nonfiction legal-thriller memoir, built alongside a source-first documentary record.",
  alternates: { canonical: "/american-injustice" },
};

const publicationStats = [
  ["39", "chapters"],
  ["~78,920", "assembled words"],
  ["291", "6 × 9 pages"],
  ["PASS", "source & rendered-PDF QA"],
] as const;

const parts = [
  ["Part I · The Origin", "2014–2017", "The flag petition, May 1 arrest, the later 2017 felony case, bond, and plea."],
  ["Part II · The Crowder Years", "2018–2021", "Family-court conflict, criminal accusations, evidence disputes, the 2021 DUI case, trial, appeal, and civil commitment."],
  ["Part III · The Second Case", "2022", "Oxford City Hall, the second aggravated-stalking prosecution, plea, banishment, revocation, and sentence."],
  ["Part IV · Galveston and Release", "2023–2025", "Release from Mississippi custody, the Galveston DWI prosecution, revocation litigation, and later release."],
  ["Part V · The Widening Record", "2025–2026", "Utah, Mississippi appellate litigation, New Orleans, federal proceedings, sentencing, and the continuing cost of constitutional litigation."],
  ["Part VI · Systemic Analysis", "Reference", "Legal analysis and appendices that separate the author's conclusions from the underlying documentary record."],
] as const;

const sourceLinks = [
  {
    title: "Publication Table of Contents",
    text: "The current 39-chapter structure and six-part organization used by the publication build.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/full-rewrite/000_contents.md",
  },
  {
    title: "Organized Evidence Archive",
    text: "Publicly organized source folders for court matters, records requests, filings, and related documentary material.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized",
  },
  {
    title: "Latest Source Packet",
    text: "A dated editorial index recording newly integrated documents, verified facts, preserved conflicts, and corrections.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/evidence-organized/NEW_SOURCE_PACKET_2026-08-22.md",
  },
  {
    title: "Sample Source-First Chapter",
    text: "The May 1, 2017 chapter demonstrates the method: surviving recording, officer report, the author's account, and limits on what the record can establish.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/full-rewrite/02_chapter2_may1_arrest.md",
  },
] as const;

const method = [
  ["Documented fact", "A fact directly supported by a filing, order, official record, recording, transcript, or other identified source."],
  ["Attributed allegation", "A disputed claim is identified as an allegation and attributed to the person or filing making it."],
  ["Record conflict", "When two records disagree, the conflict is preserved rather than silently choosing the version that best fits the narrative."],
  ["Author interpretation", "Legal theories, conclusions, and personal beliefs remain distinguishable from adjudicated findings and source documents."],
  ["Corrections", "Later-discovered dates, amounts, names, or procedural details are corrected openly in the working source record."],
] as const;

const bookSchema = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "American Injustice",
  author: {
    "@type": "Person",
    name: "Don Matthews",
    url: "https://donmatthews.live",
  },
  url: "https://donmatthews.live/american-injustice",
  inLanguage: "en",
  genre: ["Nonfiction", "Legal memoir", "Investigative journalism"],
  description: "A 39-chapter nonfiction legal-thriller memoir built alongside a source-first documentary record.",
  numberOfPages: 291,
  isBasedOn: "https://github.com/patriotnewsactivism/American-Injustice",
};

export default function AmericanInjusticePage() {
  return (
    <FlagshipPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
      <PageHero
        eyebrow="AMERICAN INJUSTICE"
        title="The story. The record behind it. Both matter."
        intro="A nonfiction legal-thriller memoir built in parallel with a documentary record so readers can follow the narrative and inspect the underlying sources for themselves."
        actions={<><GoldButton href="https://help.donmatthews.live">Explore the Current Story</GoldButton><OutlineButton href="/record">Open The Record</OutlineButton></>}
      />

      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {publicationStats.map(([value, label]) => (
            <div key={label} className="bg-[#0d0d0d] px-5 py-7 text-center">
              <div className="text-3xl font-black text-[#c9a84c]">{value}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-white/40">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">CURRENT BOOK STRUCTURE</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">A decade-long record organized into six parts.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {parts.map(([title, period, text]) => (
            <article key={title} className="rounded-xl border border-white/10 bg-white/[0.025] p-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c9a84c]">{period}</p>
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-4 leading-8 text-white/55">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">READ THE SOURCES</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">The documentary record is public.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">The public repository is not just a code archive. It contains the working manuscript, organized evidence, source indexes, transcriptions, and editorial notes used to keep narrative claims tied to the record.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {sourceLinks.map((source) => (
              <a key={source.title} href={source.href} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-white/10 bg-black/25 p-7 transition hover:border-[#c9a84c]/40">
                <h3 className="text-2xl font-bold group-hover:text-[#c9a84c]">{source.title}</h3>
                <p className="mt-3 leading-8 text-white/50">{source.text}</p>
                <span className="mt-6 inline-block text-sm font-bold text-[#c9a84c]">Open source →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">EDITORIAL METHOD</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">What the labels mean.</h2>
        <div className="mt-10 divide-y divide-white/10 rounded-xl border border-white/10">
          {method.map(([label, text]) => (
            <div key={label} className="grid gap-3 p-6 md:grid-cols-[220px_1fr] md:gap-8">
              <h3 className="font-bold text-white">{label}</h3>
              <p className="leading-7 text-white/50">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.05] p-8">
          <p className="text-xs font-black tracking-[0.18em] text-[#c9a84c]">PUBLICATION RULE</p>
          <p className="mt-4 max-w-4xl text-xl leading-9 text-white/70">A strong story does not require pretending every disputed point has already been proven. Where the documentary record supports a fact, the source should be visible. Where it does not, the limitation should be visible too.</p>
        </div>
      </section>
    </FlagshipPage>
  );
}
