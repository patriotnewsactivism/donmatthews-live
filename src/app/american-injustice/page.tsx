import type { Metadata } from "next";
import Image from "next/image";
import BookLaunchForm from "@/components/BookLaunchForm";
import { FlagshipPage, GoldButton, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "American Injustice | Don Matthews",
  description: "Pre-order American Injustice by Don Matthews and join the launch updates list.",
  alternates: { canonical: "/american-injustice" },
  openGraph: {
    title: "American Injustice | Don Matthews",
    description: "A memoir of constitutional warfare — the true story of fighting back.",
    images: [{ url: "/images/american-injustice-desktop.jpg", width: 1536, height: 864, alt: "American Injustice by Don Matthews" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "American Injustice | Don Matthews",
    description: "A memoir of constitutional warfare — the true story of fighting back.",
    images: ["/images/american-injustice-desktop.jpg"],
  },
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

const campaignProof = [
  ["A true story", "A Marine’s promise"],
  ["Constitutional warfare", "Retaliation documented"],
  ["Three federal actions", "Filed in three states"],
  ["The public record", "Evidence before narrative"],
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
  image: "https://donmatthews.live/images/american-injustice-cover.jpg",
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

      <section className="book-campaign book-campaign-hero relative isolate overflow-hidden border-b border-[#c9a84c]/25 bg-[#050504]">
        <div className="absolute inset-0 -z-30 hidden lg:block">
          <Image
            src="/images/american-injustice-desktop.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="book-campaign-wide object-cover object-[center_40%]"
          />
        </div>
        <div className="absolute inset-0 -z-20 hidden bg-[linear-gradient(90deg,#050504_0%,rgba(5,5,4,0.99)_37%,rgba(5,5,4,0.9)_50%,rgba(5,5,4,0.38)_69%,rgba(5,5,4,0.08)_100%)] lg:block" />
        <div className="absolute inset-x-0 top-0 -z-10 hidden h-28 bg-gradient-to-b from-[#050504] via-[#050504]/90 to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#050504] via-[#050504]/75 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:py-16 lg:min-h-[740px] lg:grid-cols-[.92fr_1.08fr] lg:items-center lg:gap-10 lg:py-20">
          <div className="max-w-[700px]">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c9a84c]" />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d6b85a] sm:text-xs">Pre-orders open · The true story of fighting back</p>
            </div>
            <h1 className="display-serif text-[3.35rem] font-semibold leading-[.86] tracking-[-0.055em] text-[#f2ead8] sm:text-7xl lg:text-[5.6rem] xl:text-[6.35rem]">American<br />Injustice</h1>
            <p className="display-serif mt-4 text-xl italic leading-7 text-[#d0ad4f] sm:text-3xl">A Memoir of Constitutional Warfare</p>

            <div className="mx-auto mt-8 w-full max-w-[390px] lg:hidden">
              <div className="relative rounded-[1.4rem] border border-[#c9a84c]/45 bg-black/80 p-2 shadow-[0_32px_90px_rgba(0,0,0,0.72)]">
                <Image
                  src="/images/american-injustice-cover.jpg"
                  alt="American Injustice book cover by Don Matthews"
                  width={1025}
                  height={1536}
                  priority
                  sizes="(max-width: 640px) 88vw, 390px"
                  className="h-auto w-full rounded-[.95rem] object-contain"
                />
              </div>
            </div>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8 lg:mt-6">The factual, first-person record of fighting back — told through lived experience, court filings, recordings, public documents, and the constitutional battles behind them.</p>

            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
              {formats.map((format) => (
                <a key={format.key} href={`#preorder-${format.key}`} className="rounded-lg border border-[#c9a84c]/40 bg-[#080807]/85 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:-translate-y-0.5 hover:border-[#d8b85a] hover:bg-[#c9a84c]/10">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/48">{format.label}</p>
                  <p className="mt-1 text-xl font-black text-[#d6b85a]">{format.price}</p>
                </a>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <a href="#reserve-edition" className="gold-action rounded-lg px-6 py-3.5 text-center text-sm font-black text-black transition hover:-translate-y-0.5 sm:text-base">Reserve Your Edition</a>
              <a href="#book-interest" className="rounded-lg border border-[#c9a84c]/45 bg-black/55 px-6 py-3.5 text-center text-sm font-bold text-[#e2c66d] transition hover:-translate-y-0.5 hover:border-[#d8b85a] hover:bg-[#c9a84c]/10 sm:text-base">Get Updates & Early Access</a>
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-5 text-white/40 sm:text-sm">No payment is collected yet. Your reservation is saved and checkout details will be sent when ordering opens.</p>
          </div>

          <div className="hidden min-h-[660px] lg:block" aria-hidden="true" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-2 border-x border-t border-[#c9a84c]/15 bg-black/55 sm:grid-cols-4">
          {campaignProof.map(([title, detail]) => (
            <div key={title} className="border-b border-r border-[#c9a84c]/10 px-4 py-4 last:border-r-0 sm:py-5">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#d0ad4f]">{title}</p>
              <p className="mt-1 text-xs text-white/45">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_.95fr]">
            <div id="reserve-edition" className="scroll-mt-24 rounded-2xl border border-[#c9a84c]/25 bg-black/30 p-5 sm:p-9">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c9a84c] sm:text-xs sm:tracking-[0.2em]">Reserve an edition</p>
              <h2 className="mt-3 text-2xl font-black sm:text-4xl">Pre-order interest</h2>
              <p className="mt-3 text-sm leading-6 text-white/55 sm:mt-4 sm:text-base sm:leading-7">Choose your format and leave your email. Each reservation is stored as its own event, even if you have already joined the updates list.</p>
              <BookLaunchForm mode="preorder" formats={formats} />
            </div>

            <div id="book-interest" className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-9">
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
