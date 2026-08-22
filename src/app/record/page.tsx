import type { Metadata } from "next";
import { FlagshipPage, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "The Record | Don Matthews",
  description: "A source-first archive for cases, filings, hearings, evidence, source documents, record conflicts, and major developments connected to Don Matthews' reporting and legal record.",
  alternates: { canonical: "/record" },
};

const archives = [
  ["Reardon v. Osteen", "Filings and documentary material connected to the Galveston litigation.", "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized/02-Reardon-v-Osteen"],
  ["Galveston Criminal Record", "Organized material associated with criminal case 23-CR-2981.", "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized/03-Reardon-Criminal-23-CR-2981"],
  ["Crowder v. Reardon", "Chancery and family-court source material maintained as its own record set.", "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized/04-Crowder-v-Reardon-Chancery"],
  ["Reardon v. Layton", "Utah federal-case source material and related records.", "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized/06-Reardon-v-Layton"],
  ["FBI / Beavers / East", "Complaint, correspondence, and related source material organized for review.", "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized/07-FBI-Beavers-East-Complaint"],
  ["Mississippi Court of Appeals", "Appellate filings and source documents organized by matter.", "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized/08-MS-Court-of-Appeals"],
  ["New Orleans Records", "Public-record requests and related material associated with New Orleans events.", "https://github.com/patriotnewsactivism/American-Injustice/tree/main/evidence-organized/10-NOLA-Records-Requests"],
] as const;

const examples = [
  {
    date: "May 1, 2017",
    label: "Recorded encounter + officer report",
    text: "The current manuscript reconstructs the Oxford Square arrest from both the surviving recording and Captain Timmy Pruitt's written account, while explicitly separating the factual sequence from later legal conclusions.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/full-rewrite/02_chapter2_may1_arrest.md",
  },
  {
    date: "September–November 2022",
    label: "Signed orders + later inconsistencies",
    text: "The current source packet records the September 30 sentencing order, the November 3 revocation order, and later date inconsistencies rather than silently harmonizing conflicting records.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/evidence-organized/NEW_SOURCE_PACKET_2026-08-22.md",
  },
  {
    date: "November 2025–January 2026",
    label: "Warrant, booking, records-request chronology",
    text: "The New Orleans packet preserves what the warrant affidavit says, what available video did not capture, and an unreconciled a.m./p.m. conflict in later records.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/evidence-organized/NEW_SOURCE_PACKET_2026-08-22.md",
  },
  {
    date: "August 7, 2026",
    label: "Prepared allocution + delivery record",
    text: "The repository distinguishes the prepared sentencing statement, the public livestream, and any later official transcript—and treats advocacy allegations as advocacy unless independently established.",
    href: "https://github.com/patriotnewsactivism/American-Injustice/blob/main/evidence-organized/NEW_SOURCE_PACKET_2026-08-22.md",
  },
] as const;

const labels = [
  ["VERIFIED SOURCE", "Directly supported by an identified source document, recording, transcript, order, or filing."],
  ["ATTRIBUTED CLAIM", "A statement made by a party, witness, officer, filing, or the author that remains attributed to its source."],
  ["RECORD CONFLICT", "Two or more source records materially disagree and the discrepancy remains unresolved."],
  ["COURT FINDING", "A proposition actually decided or stated by a court, kept distinct from either side's advocacy."],
  ["EDITORIAL NOTE", "Context about source quality, transcription limits, chronology, or a later correction."],
] as const;

export default function RecordPage() {
  return (
    <FlagshipPage>
      <PageHero
        eyebrow="THE RECORD"
        title="Cases. Filings. Evidence. Conflicts."
        intro="A source-first public archive built to let readers inspect the underlying record, see where documents agree, and see where they do not."
        actions={<OutlineButton href="/american-injustice">American Injustice</OutlineButton>}
      />

      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">SOURCE ARCHIVES</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">Browse the public record by matter.</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">These links open the organized public evidence repository. The archive can evolve as records are added, corrected, or reclassified without rewriting the narrative page itself.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {archives.map(([title, text, href]) => (
            <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#c9a84c]/40">
              <h3 className="text-xl font-bold group-hover:text-[#c9a84c]">{title}</h3>
              <p className="mt-3 leading-7 text-white/50">{text}</p>
              <span className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Open archive →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">HOW THE RECORD WORKS</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Examples of source-first publishing.</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {examples.map((item) => (
              <a key={`${item.date}-${item.label}`} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-black/25 p-7 hover:border-[#c9a84c]/35">
                <p className="text-xs font-black tracking-[0.16em] text-[#c9a84c]">{item.date}</p>
                <h3 className="mt-3 text-2xl font-bold">{item.label}</h3>
                <p className="mt-4 leading-8 text-white/55">{item.text}</p>
                <span className="mt-6 inline-block text-sm font-bold text-[#c9a84c]">Inspect source →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">RECORD LABELS</p>
        <h2 className="mt-3 text-4xl font-black sm:text-5xl">What readers should expect to see.</h2>
        <div className="mt-10 divide-y divide-white/10 rounded-xl border border-white/10">
          {labels.map(([label, text]) => (
            <div key={label} className="grid gap-3 p-6 md:grid-cols-[220px_1fr] md:gap-8">
              <div className="font-black tracking-[0.08em] text-[#c9a84c]">{label}</div>
              <p className="leading-7 text-white/50">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 border-l-2 border-[#c9a84c] pl-6 text-lg leading-8 text-white/55">The goal is not to make every document prove the author's theory. The goal is to make the underlying record visible enough that a reader can tell what is documented, what is alleged, what is disputed, and what changed later.</div>
      </section>
    </FlagshipPage>
  );
}
