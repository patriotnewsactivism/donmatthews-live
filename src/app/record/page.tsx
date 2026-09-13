import type { Metadata } from "next";
import DocumentArchiveBrowser from "@/components/DocumentArchiveBrowser";
import { FlagshipPage, OutlineButton, PageHero } from "@/components/FlagshipShell";
import { getPublicDocuments, type PublicDocument } from "@/lib/documentArchive";

export const metadata: Metadata = {
  title: "The Record | Don Matthews",
  description: "A source-first archive for cases, filings, hearings, evidence, source documents, record conflicts, and major developments connected to Don Matthews' reporting and legal record.",
  alternates: { canonical: "/record" },
};

const caseCollections = [
  ["Reardon v. Osteen", "Filings and documentary material connected to the Galveston litigation."],
  ["Galveston Criminal Record", "Organized material associated with criminal case 23-CR-2981."],
  ["Crowder v. Reardon", "Chancery and family-court source material maintained as its own record set."],
  ["Reardon v. Layton", "Utah federal-case source material and related records."],
  ["FBI / Beavers / East", "Complaint, correspondence, and related source material organized for review."],
  ["Mississippi Court of Appeals", "Appellate filings and source documents organized by matter."],
  ["New Orleans Records", "Public-record requests and related material associated with New Orleans events."],
] as const;

const labels = [
  ["COURT-STAMP VERIFIED", "The PDF itself has been visually reviewed and displays a court-generated filed or entered mark with a date and time."],
  ["SOURCE DOCUMENT", "A public source PDF in the archive that is not being represented as court-stamp verified solely because of its filename or title."],
  ["ATTRIBUTED CLAIM", "A statement made by a party, witness, officer, filing, or the author that remains attributed to its source."],
  ["RECORD CONFLICT", "Two or more source records materially disagree and the discrepancy remains unresolved."],
  ["COURT FINDING", "A proposition actually decided or stated by a court, kept distinct from either side's advocacy."],
  ["EDITORIAL NOTE", "Context about source quality, transcription limits, chronology, or a later correction."],
] as const;

function archiveStats(documents: PublicDocument[]) {
  const years = documents.map((item) => item.year).filter((value): value is number => Boolean(value));
  const oldest = years.length ? Math.min(...years) : null;
  const newest = years.length ? Math.max(...years) : null;
  const bytes = documents.reduce((total, item) => total + (item.size ?? 0), 0);
  const gigabytes = bytes / (1024 ** 3);
  const verified = documents.filter((document) => document.status === "court-verified").length;

  return {
    count: documents.length,
    verified,
    range: oldest && newest ? `${oldest}–${newest}` : "Chronological",
    size: gigabytes >= 1 ? `${gigabytes.toFixed(1)} GB` : `${Math.round(bytes / (1024 ** 2))} MB`,
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function RecordPage({ searchParams }: { searchParams?: SearchParams }) {
  let documents: PublicDocument[] = [];
  try {
    documents = await getPublicDocuments();
  } catch {
    documents = [];
  }

  const stats = archiveStats(documents);
  const requestedCollection = typeof searchParams?.collection === "string" ? searchParams.collection : "all";
  const initialCollection = documents.some((document) => document.collections.includes(requestedCollection)) ? requestedCollection : "all";
  const initialQuery = typeof searchParams?.q === "string" ? searchParams.q : "";

  return (
    <FlagshipPage>
      <PageHero
        eyebrow="THE RECORD"
        title="Cases. Filings. Evidence. Conflicts."
        intro="A source-first public archive built so readers can inspect the underlying record themselves—not merely read a summary of it."
        actions={<OutlineButton href="/american-injustice">American Injustice</OutlineButton>}
      />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(201,168,76,0.08),transparent_30rem),#0a0908]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">PRIMARY DOCUMENT ARCHIVE</p>
              <h2 className="display-serif mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">The source record.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/55 sm:text-lg lg:justify-self-end">
              This browser inventories the public PDFs in the document repositories and removes duplicate files by content. Court-stamp verification is tracked separately, so the archive can be complete without implying that every source document was filed or entered by a court.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-[#c9a84c]/15 bg-black/30 p-4 text-center sm:p-6"><p className="text-2xl font-black text-[#d7b85d] sm:text-3xl">{stats.count.toLocaleString()}</p><p className="mt-1 text-[9px] font-black uppercase tracking-[.14em] text-white/30 sm:text-[10px]">Public source PDFs</p></div>
            <div className="rounded-xl border border-[#c9a84c]/15 bg-black/30 p-4 text-center sm:p-6"><p className="text-2xl font-black text-[#d7b85d] sm:text-3xl">{stats.verified.toLocaleString()}</p><p className="mt-1 text-[9px] font-black uppercase tracking-[.14em] text-white/30 sm:text-[10px]">Court-stamp verified</p></div>
            <div className="rounded-xl border border-[#c9a84c]/15 bg-black/30 p-4 text-center sm:p-6"><p className="text-2xl font-black text-[#d7b85d] sm:text-3xl">{stats.range}</p><p className="mt-1 text-[9px] font-black uppercase tracking-[.14em] text-white/30 sm:text-[10px]">Date range</p></div>
            <div className="rounded-xl border border-[#c9a84c]/15 bg-black/30 p-4 text-center sm:p-6"><p className="text-2xl font-black text-[#d7b85d] sm:text-3xl">{stats.size}</p><p className="mt-1 text-[9px] font-black uppercase tracking-[.14em] text-white/30 sm:text-[10px]">Indexed PDF size</p></div>
          </div>

          <div className="mt-8">
            {documents.length ? (
              <DocumentArchiveBrowser documents={documents} initialCollection={initialCollection} initialQuery={initialQuery} />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-7 text-white/50">
                The document index could not be loaded right now. Please try again shortly.
              </div>
            )}
          </div>

          <p className="mt-6 max-w-4xl text-sm leading-6 text-white/40">
            Verification remains fail-closed: a filename, title, signature date, fax header, or “filing ready” label does not establish filing status. Documents carrying the Court-stamp verified label were separately reviewed for a visible court-generated filing or entry mark.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">CASE-CENTERED COLLECTIONS</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">Evidence organized by matter.</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/55">These links now stay inside DonMatthews.live and filter the same public archive by matter instead of sending visitors into a source-code directory.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {caseCollections.map(([title, text]) => {
            const count = documents.filter((document) => document.collections.includes(title)).length;
            return (
              <a key={title} href={`/record?collection=${encodeURIComponent(title)}#archive`} className="group rounded-xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-[#c9a84c]/40">
                <h3 className="text-xl font-bold group-hover:text-[#c9a84c]">{title}</h3>
                <p className="mt-3 leading-7 text-white/50">{text}</p>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-white/30">{count.toLocaleString()} indexed PDF{count === 1 ? "" : "s"}</p>
                <span className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Browse collection →</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">RECORD LABELS</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">What the words mean here.</h2>
          <div className="mt-10 divide-y divide-white/10 rounded-xl border border-white/10">
            {labels.map(([label, text]) => (
              <div key={label} className="grid gap-3 p-6 md:grid-cols-[220px_1fr] md:gap-8">
                <div className="font-black tracking-[0.08em] text-[#c9a84c]">{label}</div>
                <p className="leading-7 text-white/50">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 border-l-2 border-[#c9a84c] pl-6 text-lg leading-8 text-white/55">The archive is not designed to make every document prove one theory. It is designed to keep the source material visible enough that a reader can distinguish documentation, allegation, dispute, ruling, and later correction.</div>
        </div>
      </section>
    </FlagshipPage>
  );
}
