import type { Metadata } from "next";
import Image from "next/image";
import BookLaunchForm from "@/components/BookLaunchForm";
import { FlagshipPage, GoldButton, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "American Injustice | Don Matthews",
  description: "Pre-order American Injustice by Don Matthews and join the launch updates list.",
  alternates: { canonical: "/american-injustice" },
};

const publicationStats = [
  ["39", "chapters"],
  ["~78,920", "assembled words"],
  ["291", "6 × 9 pages"],
  ["PASS", "source & rendered-PDF QA"],
] as const;

const formats = [
  { key: "paperback", label: "Paperback", price: "$25.99", detail: "Print edition" },
  { key: "hardback", label: "Hardback", price: "$35.99", detail: "Premium hardcover edition" },
  { key: "audiobook", label: "Audiobook", price: "$15", detail: "Read by the author" },
  { key: "ebook", label: "eBook", price: "FREE", detail: "With a donation of any amount" },
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
  image: "https://donmatthews.live/images/american-injustice-cover.svg",
  url: "https://donmatthews.live/american-injustice",
  inLanguage: "en",
  genre: ["Nonfiction", "Legal memoir", "Investigative journalism"],
  description: "A 39-chapter nonfiction legal-thriller memoir built alongside a source-first documentary record.",
  numberOfPages: 291,
  isBasedOn: "https://github.com/patriotnewsactivism/American-Injustice",
  offers: [
    { "@type": "Offer", priceCurrency: "USD", price: "25.99", availability: "https://schema.org/PreOrder", name: "Paperback" },
    { "@type": "Offer", priceCurrency: "USD", price: "35.99", availability: "https://schema.org/PreOrder", name: "Hardback" },
    { "@type": "Offer", priceCurrency: "USD", price: "15.00", availability: "https://schema.org/PreOrder", name: "Audiobook — read by author" },
    { "@type": "Offer", priceCurrency: "USD", price: "0.00", availability: "https://schema.org/PreOrder", name: "eBook — free with a donation of any amount" },
  ],
};

export default function AmericanInjusticePage() {
  return (
    <FlagshipPage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />

      <section className="book-campaign relative overflow-hidden border-b border-[#c9a84c]/20 bg-[#070706]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(201,168,76,0.14),transparent_32%),radial-gradient(circle_at_10%_90%,rgba(201,168,76,0.05),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:py-18 lg:grid-cols-[1.18fr_.82fr] lg:items-center lg:gap-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3"><span className="h-px w-10 bg-[#c9a84c]" /><p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a84c] sm:text-xs">Pre-orders open</p></div>
            <h1 className="display-serif text-[3.2rem] font-semibold leading-[.88] tracking-[-0.05em] text-[#f0e7d0] sm:text-6xl lg:text-[5.4rem]">American<br />Injustice</h1>
            <p className="display-serif mt-4 text-xl italic leading-7 text-[#c9a84c] sm:text-3xl">A Memoir of Constitutional Warfare</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/62 sm:text-lg sm:leading-8">The true story of fighting back — told through lived experience, court records, recordings, public documents, and the constitutional battles behind them.</p>
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
              {formats.map((format) => (<a key={format.key} href={`#preorder-${format.key}`} className="rounded-xl border border-[#c9a84c]/30 bg-black/35 px-4 py-3.5 transition hover:border-[#c9a84c]/65 hover:bg-[#c9a84c]/[0.06]"><p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/42">{format.label}</p><p className="mt-1 text-xl font-black text-[#d6b85a]">{format.price}</p></a>))}
            </div>
            <p className="mt-5 max-w-2xl text-xs leading-5 text-white/38 sm:text-sm sm:leading-6">Reserve your edition and join the launch list. No payment is collected here yet; checkout will be connected separately.</p>
          </div>
          <div className="mx-auto w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[390px]">
            <div className="relative rounded-[1.4rem] border border-[#c9a84c]/35 bg-black/70 p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.68)]">
              <Image src="/images/american-injustice-cover.svg" alt="American Injustice book cover" width={1600} height={2560} unoptimized priority className="h-auto w-full rounded-[.95rem] object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-2xl border border-[#c9a84c]/25 bg-black/30 p-5 sm:p-9">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a84c] sm:text-xs sm:tracking-[0.2em]">Reserve an edition</p>
              <h2 className="mt-3 text-2xl font-black sm:text-4xl">Pre-order interest</h2>
              <p className="mt-3 text-sm leading-6 text-white/55 sm:mt-4 sm:text-base sm:leading-7">Choose your format and leave your email. Each reservation is stored as its own event, even if you have already joined the updates list.</p>
              <BookLaunchForm mode="preorder" formats={formats} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-9">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a84c] sm:text-xs sm:tracking-[0.2em]">Stay informed</p>
              <h2 className="mt-3 text-2xl font-black sm:text-4xl">Get updates and early access</h2>
              <p className="mt-3 text-sm leading-6 text-white/55 sm:mt-4 sm:text-base sm:leading-7">Be first to know about release dates, excerpts, preorder checkout, audiobook availability, and publication news.</p>
              <BookLaunchForm mode="interest" formats={formats} />
              <div className="mt-6 rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/[0.05] p-4 sm:mt-7 sm:p-5">
                <p className="font-bold text-[#c9a84c]">eBook offer</p>
                <p className="mt-2 text-sm leading-6 text-white/55">The eBook will be free with a donation of any amount. Donation fulfillment will be connected to the preorder checkout workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
          {publicationStats.map(([value, label]) => (
            <div key={label} className="bg-[#0d0d0d] px-4 py-5 text-center sm:px-5 sm:py-7">
              <div className="text-2xl font-black text-[#c9a84c] sm:text-3xl">{value}</div>
              <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 sm:mt-2 sm:text-xs sm:tracking-[0.14em]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <PageHero
        eyebrow="AMERICAN INJUSTICE"
        title="The story. The record behind it. Both matter."
        intro="A nonfiction legal-thriller memoir built in parallel with a documentary record so readers can follow the narrative and inspect the underlying sources for themselves."
        actions={<><GoldButton href="https://help.donmatthews.live">Explore the Current Story</GoldButton><OutlineButton href="/record">Open The Record</OutlineButton></>}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">CURRENT BOOK STRUCTURE</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-5xl">A decade-long record organized into six parts.</h2>
        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {parts.map(([title, period, text]) => (
            <article key={title} className="rounded-xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c9a84c]">{period}</p>
              <h3 className="mt-3 text-xl font-bold sm:text-2xl">{title}</h3>
              <p className="mt-3 leading-7 text-white/55 sm:mt-4 sm:leading-8">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">READ THE SOURCES</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">The documentary record is public.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/55 sm:mt-5 sm:text-lg sm:leading-8">The public repository is not just a code archive. It contains the working manuscript, organized evidence, source indexes, transcriptions, and editorial notes used to keep narrative claims tied to the record.</p>
          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2">
            {sourceLinks.map((source) => (
              <a key={source.title} href={source.href} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-white/10 bg-black/25 p-6 transition hover:border-[#c9a84c]/40 sm:p-7">
                <h3 className="text-xl font-bold group-hover:text-[#c9a84c] sm:text-2xl">{source.title}</h3>
                <p className="mt-3 leading-7 text-white/50 sm:leading-8">{source.text}</p>
                <span className="mt-5 inline-block text-sm font-bold text-[#c9a84c] sm:mt-6">Open source →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">EDITORIAL METHOD</p>
        <h2 className="mt-3 text-3xl font-black sm:text-5xl">What the labels mean.</h2>
        <div className="mt-8 divide-y divide-white/10 rounded-xl border border-white/10 sm:mt-10">
          {method.map(([label, text]) => (
            <div key={label} className="grid gap-2 p-5 sm:p-6 md:grid-cols-[220px_1fr] md:gap-8">
              <h3 className="font-bold text-white">{label}</h3>
              <p className="leading-7 text-white/50">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.05] p-6 sm:mt-12 sm:p-8">
          <p className="text-xs font-black tracking-[0.18em] text-[#c9a84c]">PUBLICATION RULE</p>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-white/70 sm:text-xl sm:leading-9">A strong story does not require pretending every disputed point has already been proven. Where the documentary record supports a fact, the source should be visible. Where it does not, the limitation should be visible too.</p>
        </div>
      </section>
    </FlagshipPage>
  );
}
