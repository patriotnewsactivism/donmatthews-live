import type { Metadata } from "next";
import { FlagshipPage, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "The Record | Don Matthews",
  description: "A structured archive for cases, filings, hearings, evidence, source documents, and major developments connected to Don Matthews' reporting and legal record.",
  alternates: { canonical: "/record" },
};

const categories = [
  ["Cases", "Case-level pages with jurisdiction, docket information, parties, posture, and related material."],
  ["Filings", "Motions, briefs, orders, notices, exhibits, and other documents organized by date and matter."],
  ["Hearings & Transcripts", "Hearing dates, transcript material, recordings where lawfully available, and concise summaries."],
  ["Evidence & Source Material", "Primary-source documents and media separated from commentary so readers can inspect the record directly."],
  ["Developments", "Material procedural changes, rulings, dismissals, appeals, public-record releases, and documented corrections."],
  ["Corrections & Context", "A permanent place to distinguish allegation, disputed fact, verified document, court finding, and later correction."],
];

export default function RecordPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="THE RECORD" title="Cases. Filings. Evidence. Developments." intro="A date-driven public archive designed to make complex legal and investigative material easier to verify, navigate, and cite." actions={<OutlineButton href="/american-injustice">American Injustice</OutlineButton>} />
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map(([title, text]) => <div key={title} className="rounded-xl border border-white/10 bg-white/[0.025] p-7"><h2 className="text-2xl font-bold">{title}</h2><p className="mt-4 leading-8 text-white/50">{text}</p></div>)}
        </div>
        <div className="mt-14 border-l-2 border-[#c9a84c] pl-6 text-lg leading-8 text-white/55">This archive is being built around source-first publishing: significant factual assertions should point readers toward the document, recording, transcript, filing, or other material supporting them whenever that material can be published lawfully.</div>
      </section>
    </FlagshipPage>
  );
}
