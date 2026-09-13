import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlagshipPage, OutlineButton } from "@/components/FlagshipShell";
import { getPublicDocumentBySlug } from "@/lib/documentArchive";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const document = await getPublicDocumentBySlug(params.slug);
  if (!document) return { title: "Document not found | Don Matthews" };

  return {
    title: `${document.title} | The Record | Don Matthews`,
    description: `View ${document.title} in the Don Matthews public document archive.`,
    alternates: { canonical: `/record/document/${document.slug}` },
  };
}

function formatDate(date: string | null) {
  if (!date) return "Undated";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function RecordDocumentPage({ params }: PageProps) {
  const document = await getPublicDocumentBySlug(params.slug);
  if (!document) notFound();

  const pdfPath = `/api/record/document/${encodeURIComponent(document.slug)}`;
  const verified = document.status === "court-verified";

  return (
    <FlagshipPage>
      <section className="border-b border-white/10 bg-[#0a0908]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.14em]">
            <span className="text-[#c9a84c]">The Record</span>
            <span className="text-white/20">/</span>
            <span className={verified ? "text-[#e5cb7c]" : "text-white/40"}>{verified ? "Court-stamp verified" : "Source document"}</span>
          </div>
          <h1 className="display-serif mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">{document.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/45">
            <span>{formatDate(document.date)}</span>
            {document.court ? <span>{document.court}</span> : null}
            {document.docket ? <span>{document.docket}</span> : null}
            {document.filedAt ? <span>Court mark: {document.filedAt}</span> : null}
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-white/35">Collection: {document.collections.join(" · ")}</p>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-white/35">Download filename: {document.canonicalFileName}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <OutlineButton href="/record">Back to the archive</OutlineButton>
            <a href={pdfPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md bg-[#c9a84c] px-5 py-3 text-sm font-black text-black transition hover:bg-[#e5cb7c]">Open PDF</a>
            <a href={`${pdfPath}?download=1`} className="inline-flex items-center justify-center rounded-md border border-white/15 px-5 py-3 text-sm font-black text-white/75 transition hover:border-[#c9a84c]/50 hover:text-white">Download</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-5 sm:py-10">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl shadow-black/30">
          <iframe
            src={pdfPath}
            title={document.title}
            className="h-[72vh] min-h-[620px] w-full bg-white"
          />
        </div>
        <p className="mx-auto mt-4 max-w-4xl text-center text-xs leading-5 text-white/35">The PDF loads only on this document page. The archive index itself remains lightweight.</p>
      </section>
    </FlagshipPage>
  );
}
