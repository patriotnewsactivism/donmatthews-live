"use client";

import { useMemo, useState } from "react";
import type { PublicDocument } from "@/lib/documentArchive";

function formatDate(date: string | null) {
  if (!date) return "Undated";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatSize(size: number | null) {
  if (!size) return null;
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(size >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
}

export default function DocumentArchiveBrowser({
  documents,
  initialQuery = "",
  initialCollection = "all",
}: {
  documents: PublicDocument[];
  initialQuery?: string;
  initialCollection?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [year, setYear] = useState("all");
  const [collection, setCollection] = useState(initialCollection);
  const [status, setStatus] = useState("all");

  const years = useMemo(
    () => Array.from(new Set(documents.map((document) => document.year).filter((value): value is number => Boolean(value)))).sort((a, b) => b - a),
    [documents],
  );

  const collections = useMemo(
    () => Array.from(new Set(documents.flatMap((document) => document.collections))).sort((a, b) => a.localeCompare(b)),
    [documents],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return documents.filter((document) => {
      const matchesYear = year === "all" || document.year === Number(year);
      const matchesCollection = collection === "all" || document.collections.includes(collection);
      const matchesStatus = status === "all" || document.status === status;
      const matchesQuery = !normalized || [
        document.title,
        document.fileName,
        document.canonicalFileName,
        document.collections.join(" "),
        document.date,
        document.filedAt,
        document.court,
        document.docket,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      return matchesYear && matchesCollection && matchesStatus && matchesQuery;
    });
  }, [collection, documents, query, status, year]);

  return (
    <div id="archive">
      <div className="grid gap-3 rounded-2xl border border-[#c9a84c]/20 bg-black/30 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-[1fr_150px_230px_190px]">
        <label className="block">
          <span className="sr-only">Search source documents</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search names, cases, filings, people, dates…"
            className="w-full rounded-lg border border-white/10 bg-[#0b0b0a] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#c9a84c]/60"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter documents by year</span>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0b0b0a] px-4 py-3 text-sm text-white outline-none focus:border-[#c9a84c]/60"
          >
            <option value="all">All years</option>
            {years.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Filter documents by collection</span>
          <select
            value={collection}
            onChange={(event) => setCollection(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0b0b0a] px-4 py-3 text-sm text-white outline-none focus:border-[#c9a84c]/60"
          >
            <option value="all">All collections</option>
            {collections.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Filter documents by verification status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0b0b0a] px-4 py-3 text-sm text-white outline-none focus:border-[#c9a84c]/60"
          >
            <option value="all">All source PDFs</option>
            <option value="court-verified">Court-stamp verified</option>
            <option value="source-document">Other source documents</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.12em] text-white/35">
        <span>{filtered.length.toLocaleString()} document{filtered.length === 1 ? "" : "s"} shown</span>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setYear("all");
            setCollection("all");
            setStatus("all");
          }}
          className="text-[#c9a84c] transition hover:text-[#e5cb7c]"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0a09]">
        {filtered.length ? (
          <div className="divide-y divide-white/8">
            {filtered.map((document) => {
              const size = formatSize(document.size);
              const verified = document.status === "court-verified";
              return (
                <a
                  key={document.slug}
                  href={document.href}
                  className="group grid gap-3 px-5 py-5 transition hover:bg-[#c9a84c]/[0.045] sm:grid-cols-[130px_1fr_auto] sm:items-center sm:px-6"
                >
                  <div>
                    <p className="text-xs font-black tracking-[0.08em] text-[#c9a84c]">{formatDate(document.date)}</p>
                    {size ? <p className="mt-1 text-[10px] text-white/25">PDF · {size}</p> : <p className="mt-1 text-[10px] text-white/25">PDF</p>}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold leading-6 text-[#eee5d3] transition group-hover:text-[#e5c96f] sm:text-lg">{document.title}</h3>
                      <span className={verified
                        ? "rounded-full border border-[#c9a84c]/35 bg-[#c9a84c]/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.11em] text-[#e5cb7c]"
                        : "rounded-full border border-white/10 bg-white/[0.035] px-2 py-1 text-[9px] font-black uppercase tracking-[0.11em] text-white/40"
                      }>
                        {verified ? "Court-stamp verified" : "Source document"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/40">{document.collections.join(" · ")}</p>
                    {(document.court || document.docket) ? (
                      <p className="mt-1 text-xs text-white/40">{[document.court, document.docket].filter(Boolean).join(" · ")}</p>
                    ) : null}
                    {document.filedAt ? <p className="mt-1 text-xs font-bold text-[#c9a84c]/75">Court mark: {document.filedAt}</p> : null}
                  </div>
                  <span className="text-sm font-black text-[#c9a84c] sm:pl-4">View →</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-white/45">No documents match those filters.</div>
        )}
      </div>
    </div>
  );
}
