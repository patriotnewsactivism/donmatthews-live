import Image from "next/image";
import Link from "next/link";
import AmericanInjusticeBanner from "@/components/AmericanInjusticeBanner";
import AllocutionVideo from "@/components/AllocutionVideo";
import CaughtRedHandedVideo from "@/components/CaughtRedHandedVideo";
import FlagshipLeadForm from "@/components/FlagshipLeadForm";
import { LatestArticlesSection } from "@/components/LatestArticlesSection";
import { SiteFooter } from "@/components/FlagshipShell";

const projects = [
  ["BuildMyBot.App", "AI agency in a box. Deploy an AI workforce in minutes.", "https://buildmybot.app", "LIVE"],
  ["We The People News", "Independent investigative journalism and government accountability.", "https://wtpnews.org", "LIVE"],
  ["Civil Rights Hub", "Resources and tools for civil-rights advocacy.", "https://civilrightshub.org", "LIVE"],
  ["ChatScream", "AI-powered real-time communication and streaming platform.", "https://chatscream.live", "LIVE"],
  ["TubeScribe", "Video transcription and AI-assisted media analysis.", "https://tubescribe.donmatthews.live", "BETA"],
] as const;

const lanes = [
  {
    eyebrow: "01 · INVESTIGATIVE JOURNALISM",
    title: "Field reporting and the public record.",
    text: "Government accountability, public records, civil-rights reporting, and the work of We The People News.",
    href: "https://wtpnews.org",
    image: "/images/field-journalist.jpg",
    imageAlt: "Don Matthews working in the field as a journalist",
  },
  {
    eyebrow: "02 · TECHNOLOGY & AI",
    title: "Software built to do real work.",
    text: "AI systems, autonomous-agent architecture, business automation, legal technology, communications, and practical software products.",
    href: "/technology",
    image: "/images/portrait-bw.jpg",
    imageAlt: "Black and white portrait of Don Matthews",
  },
  {
    eyebrow: "03 · AMERICAN INJUSTICE",
    title: "The story and the evidence behind it.",
    text: "The nonfiction legal-thriller memoir and the source-first documentary record built alongside it.",
    href: "/american-injustice",
    image: "/images/american-injustice-cover.jpg",
    imageAlt: "American Injustice book cover by Don Matthews",
  },
  {
    eyebrow: "04 · DOCUMENTARY MUSIC",
    title: "Bad Actors.",
    text: "Music built around evidence, conflict, accountability, and the stories that live behind the public record.",
    href: "/music",
    image: "/images/bad-actors-cover.jpg",
    imageAlt: "Bad Actors album cover",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#090807] text-[#f5eedb]">
      <AmericanInjusticeBanner />

      <section className="border-b border-[#c9a84c]/15 bg-[radial-gradient(circle_at_20%_0%,rgba(201,168,76,0.08),transparent_32rem),#0a0908]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d5b45b] sm:text-xs">THE FLAGSHIP</p>
              <h2 className="display-serif mt-4 max-w-3xl text-4xl font-semibold leading-[.95] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                One platform. Four lanes.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-white/55 sm:text-lg lg:justify-self-end">
              American Injustice leads the site. Journalism, technology, the documentary record, and music branch from the same source-first mission instead of competing for the first screen.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {lanes.map((lane) => {
              const card = (
                <>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-black">
                    <Image
                      src={lane.image}
                      alt={lane.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#c9a84c]">{lane.eyebrow}</p>
                    <h3 className="display-serif mt-4 text-2xl font-semibold leading-tight text-[#f0e6d3]">{lane.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/50">{lane.text}</p>
                    <span className="mt-6 inline-block text-sm font-black text-[#dbbb66]">Explore →</span>
                  </div>
                </>
              );

              return lane.href.startsWith("http") ? (
                <a
                  key={lane.eyebrow}
                  href={lane.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(160deg,#14110e,#0d0b09)] transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40"
                >
                  {card}
                </a>
              ) : (
                <Link
                  key={lane.eyebrow}
                  href={lane.href}
                  className="group overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(160deg,#14110e,#0d0b09)] transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0b09]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:py-24 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
          <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[1.5rem] border border-[#c9a84c]/20 bg-black p-2 shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
            <Image
              src="/images/wanted-poster.jpg"
              alt="Wanted poster artwork from the Don Matthews documentary record"
              width={1024}
              height={1060}
              sizes="(max-width: 1024px) 90vw, 520px"
              className="h-auto w-full rounded-[1rem] object-contain"
            />
          </div>

          <div className="lg:pl-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a84c] sm:text-xs">THE RECORD</p>
            <h2 className="display-serif mt-4 text-4xl font-semibold leading-[.95] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Cases. Filings.<br />Evidence. Conflicts.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
              A source-first public archive built to distinguish documents, allegations, court findings, unresolved conflicts, and editorial corrections. The record stays visible so readers can inspect the source material instead of being asked to take anyone&apos;s word for it.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                ["Verified source", "Directly supported by an identified record."],
                ["Attributed claim", "A disputed statement preserved with its source."],
                ["Record conflict", "Contradictions remain visible instead of being erased."],
                ["Court finding", "What a court actually stated or decided."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/8 bg-white/[0.025] p-4">
                  <p className="text-sm font-black text-[#e5ce8b]">{title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-white/42">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/record" className="rounded-lg bg-[#c9a84c] px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-[#dab95f]">Open The Record</Link>
              <Link href="/american-injustice" className="rounded-lg border border-[#c9a84c]/35 px-5 py-3 text-sm font-black text-[#e0c370] transition hover:-translate-y-0.5 hover:bg-[#c9a84c]/10">Book & Source Archive</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#100e0c,#090807)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a84c] sm:text-xs">VENTURES</p>
              <h2 className="display-serif mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Built to work.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/52 sm:text-lg">AI platforms, journalism tools, legal technology, communications products, and civil-rights resources.</p>
            </div>
            <Link href="/projects" className="text-sm font-black text-[#d8b85e]">View all projects →</Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map(([title, text, href, status], index) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group min-h-[220px] rounded-[1.25rem] border border-white/9 bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/38"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#c9a84c]">{status}</span>
                  <span className="text-xs font-black text-white/15">0{index + 1}</span>
                </div>
                <h3 className="display-serif mt-9 text-2xl font-semibold text-[#f0e5d1]">{title}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/48">{text}</p>
                <span className="mt-6 inline-block text-sm font-black text-[#d5b45b] transition group-hover:translate-x-1">Visit project →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <AllocutionVideo />

      <LatestArticlesSection />

      <section className="border-y border-white/10 bg-[#0b0a09]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:py-24 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[1.5rem] border border-[#c9a84c]/18 bg-black p-2 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <Image
              src="/images/bad-actors-cover.jpg"
              alt="Bad Actors album cover"
              width={1024}
              height={1024}
              sizes="(max-width: 1024px) 88vw, 460px"
              className="h-auto w-full rounded-[1rem]"
            />
          </div>
          <div className="lg:pl-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a84c] sm:text-xs">DOCUMENTARY MUSIC</p>
            <h2 className="display-serif mt-4 text-5xl font-semibold leading-[.9] tracking-[-0.04em] sm:text-7xl">Bad Actors.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">Music built from the same documentary impulse: evidence, conflict, accountability, betrayal, and the stories underneath the headlines.</p>
            <Link href="/music" className="mt-8 inline-flex rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-5 py-3 text-sm font-black text-[#e0c16b] transition hover:-translate-y-0.5 hover:bg-[#c9a84c]/15">Explore Music →</Link>
          </div>
        </div>
      </section>

      <CaughtRedHandedVideo />

      <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(201,168,76,0.08),transparent_32rem),#090807]">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:py-24">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a84c] sm:text-xs">STAY CONNECTED</p>
          <h2 className="display-serif mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Book. Cases. Projects. Music.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/52 sm:text-lg">Join the flagship update list for major investigations, product launches, American Injustice publication news, music releases, and important developments from The Record.</p>
          <div className="mx-auto mt-8 max-w-3xl text-left"><FlagshipLeadForm /></div>
          <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm font-black text-[#d6b65e]">
            <Link href="/updates">Updates →</Link>
            <Link href="/press">Press & Media →</Link>
            <Link href="/support">Support →</Link>
            <Link href="/contact">Contact →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
