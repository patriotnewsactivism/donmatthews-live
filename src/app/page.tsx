import Image from "next/image";
import Link from "next/link";
import FlagshipLeadForm from "@/components/FlagshipLeadForm";
import { LatestArticlesSection } from "@/components/LatestArticlesSection";
import { SiteFooter, SiteHeader } from "@/components/FlagshipShell";

const pillars = [
  {
    title: "Investigative Journalism",
    text: "Government accountability, public records, field reporting, and We The People News.",
    href: "https://wtpnews.org",
    cta: "Visit WTP News",
  },
  {
    title: "Technology & AI",
    text: "AI systems, software products, autonomous workforces, and tools built for real-world use.",
    href: "/technology",
    cta: "Explore Technology",
  },
  {
    title: "American Injustice",
    text: "The nonfiction legal-thriller memoir and the documentary record behind it.",
    href: "/american-injustice",
    cta: "Enter the Book Hub",
  },
  {
    title: "Music",
    text: "Bad Actors and documentary-style releases built around evidence, conflict, and accountability.",
    href: "/music",
    cta: "Hear the Work",
  },
];

const projects = [
  ["BuildMyBot.App", "AI agency in a box. Deploy an AI workforce in minutes.", "https://buildmybot.app"],
  ["CaseBuddy", "AI-powered legal research and case-management tools.", "https://casebuddy.live"],
  ["We The People News", "Independent investigative journalism and government accountability.", "https://wtpnews.org"],
  ["Civil Rights Hub", "Resources and tools for civil-rights advocacy.", "https://civilrightshub.org"],
  ["ChatScream", "AI-powered real-time communication and streaming platform.", "https://chatscream.live"],
  ["TubeScribe", "Video transcription and AI-assisted media analysis.", "https://tubescribe.donmatthews.live"],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-[#c9a84c]/15 bg-[#080808]">
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_78%_18%,rgba(201,168,76,0.2),transparent_30%),radial-gradient(circle_at_12%_78%,rgba(201,168,76,0.07),transparent_28%)]" />
        <div className="absolute inset-0 -z-20 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -right-16 top-16 -z-10 h-56 w-56 rounded-full border border-[#c9a84c]/10 sm:h-80 sm:w-80" />
        <div className="absolute -right-3 top-28 -z-10 h-32 w-32 rounded-full border border-[#c9a84c]/10 sm:h-52 sm:w-52" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:gap-10 sm:py-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-14 lg:py-24">
          <div className="self-center">
            <Link href="/american-injustice" className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#c9a84c] transition hover:bg-[#c9a84c]/10 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.9)]" />
              American Injustice pre-orders open
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#c9a84c] sm:w-12" />
              <p className="text-[9px] font-black tracking-[0.22em] text-[#c9a84c] sm:text-xs sm:tracking-[0.24em]">DONMATTHEWS.LIVE · OFFICIAL FLAGSHIP</p>
            </div>

            <h1 className="mt-4 max-w-4xl text-[2.2rem] font-black leading-[.92] tracking-[-0.045em] sm:mt-5 sm:text-6xl sm:tracking-normal lg:text-8xl">
              <span className="block">Journalism.</span>
              <span className="block text-white/72">Technology.</span>
              <span className="block text-[#c9a84c]">Music. <span className="text-white">The Record.</span></span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/58 sm:mt-7 sm:max-w-2xl sm:text-xl sm:leading-8">Independent work spanning investigative journalism, AI and software, civil-rights advocacy, documentary music, and <em>American Injustice</em>.</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <Link href="/projects" className="rounded-lg bg-[#c9a84c] px-4 py-3 text-center text-sm font-black text-black shadow-[0_12px_40px_rgba(201,168,76,0.12)] transition hover:-translate-y-0.5 hover:bg-[#d9bb64] sm:px-6 sm:text-base">Explore the Work</Link>
              <Link href="/american-injustice" className="rounded-lg border border-[#c9a84c]/45 bg-black/20 px-4 py-3 text-center text-sm font-black text-[#c9a84c] transition hover:bg-[#c9a84c]/10 sm:px-6 sm:text-base">The Book</Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 sm:text-xs">
              <span>Journalism</span><span>AI & Software</span><span>Author</span><span>Music</span>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="relative overflow-hidden rounded-2xl border border-[#c9a84c]/25 bg-[#111] shadow-2xl shadow-black/60">
              <div className="relative h-[210px]">
                <Image src="/images/wanted-poster.jpg" alt="Don Matthews — We The People News" fill priority sizes="(max-width: 1024px) 100vw, 0px" className="object-cover object-top opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(8,8,8,0.95)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#c9a84c]">Field work · public record</p>
                    <p className="mt-1 text-sm font-bold text-white/85">Independent. Documented. Built in public.</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[9px] font-black tracking-[0.12em] text-white/55">WTP NEWS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-md lg:block lg:max-w-none">
            <div className="absolute -inset-5 rounded-3xl border border-[#c9a84c]/10" />
            <div className="absolute -inset-4 rounded-2xl bg-[#c9a84c]/10 blur-3xl" />
            <Image src="/images/wanted-poster.jpg" alt="Don Matthews — We The People News" width={900} height={1200} priority className="relative rotate-1 rounded-xl border border-[#c9a84c]/30 shadow-2xl shadow-black/60" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4 md:hidden">
          <div><p className="text-[10px] font-black tracking-[0.2em] text-[#c9a84c]">FLAGSHIP PILLARS</p><h2 className="mt-1 text-2xl font-black">Four lanes. One platform.</h2></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/30">Swipe →</span>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
          {pillars.map((pillar, index) => pillar.href.startsWith("http") ? (
            <a key={pillar.title} href={pillar.href} target="_blank" rel="noopener noreferrer" className="group min-w-[82vw] snap-center rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] p-6 transition hover:-translate-y-1 hover:border-[#c9a84c]/40 md:min-w-0">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black tracking-[0.16em] text-[#c9a84c]">FLAGSHIP PILLAR</p><span className="text-xs font-black text-white/20">0{index + 1}</span></div><h2 className="mt-4 text-2xl font-black">{pillar.title}</h2><p className="mt-3 leading-7 text-white/50">{pillar.text}</p><span className="mt-7 inline-block text-sm font-bold text-[#c9a84c]">{pillar.cta} →</span>
            </a>
          ) : (
            <Link key={pillar.title} href={pillar.href} className="group min-w-[82vw] snap-center rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] p-6 transition hover:-translate-y-1 hover:border-[#c9a84c]/40 md:min-w-0">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black tracking-[0.16em] text-[#c9a84c]">FLAGSHIP PILLAR</p><span className="text-xs font-black text-white/20">0{index + 1}</span></div><h2 className="mt-4 text-2xl font-black">{pillar.title}</h2><p className="mt-3 leading-7 text-white/50">{pillar.text}</p><span className="mt-7 inline-block text-sm font-bold text-[#c9a84c]">{pillar.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">VENTURES</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h2 className="text-3xl font-black sm:text-5xl">Featured Projects</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">AI platforms, journalism tools, civil-rights resources, and software built for real-world use.</p></div><Link href="/projects" className="font-bold text-[#c9a84c]">View all projects →</Link></div>
          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">{projects.map(([title, text, href]) => <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-[#101010] p-6 transition hover:-translate-y-0.5 hover:border-[#c9a84c]/35"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-white/55">{text}</p><span className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Visit →</span></a>)}</div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_25%,rgba(201,168,76,0.11),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:gap-10 sm:py-24 lg:grid-cols-[.55fr_1.45fr] lg:items-center">
          <div className="mx-auto w-full max-w-[210px] sm:max-w-[250px]">
            <Image src="/images/american-injustice-cover.jpg" alt="American Injustice book cover" width={320} height={480} className="w-full rounded-xl border border-[#c9a84c]/30 shadow-2xl shadow-black/70" />
          </div>
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE BOOK · PRE-ORDERS OPEN</p>
            <h2 className="mt-3 text-4xl font-black sm:text-6xl">American Injustice</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/62 sm:text-xl sm:leading-9">A factual, first-person legal-thriller memoir built from lived experience, court records, recordings, public documents, and the collision between one citizen and government power.</p>
            <p className="mt-4 max-w-3xl leading-8 text-white/42">Paperback $25.99 · Hardback $35.99 · Author-read audiobook $15 · eBook free with a donation of any amount.</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"><Link href="/american-injustice" className="rounded-lg bg-[#c9a84c] px-5 py-3 text-center text-sm font-black text-black hover:bg-[#d9bb64] sm:text-base">Pre-order / Join Updates</Link><Link href="/record" className="rounded-lg border border-white/15 px-5 py-3 text-center text-sm font-bold text-white/70 hover:border-[#c9a84c]/35 hover:text-white sm:text-base">Inspect The Record</Link></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-14 sm:gap-10 sm:py-20 lg:grid-cols-2"><div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE RECORD</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Cases, filings, evidence, conflicts.</h2></div><div className="space-y-4 text-base leading-8 text-white/60 sm:text-lg"><p>A source-first public archive that distinguishes documents, allegations, court findings, unresolved conflicts, and editorial corrections.</p><Link href="/record" className="inline-block font-bold text-[#c9a84c]">Open The Record →</Link></div></div>
      </section>

      <LatestArticlesSection />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:gap-10 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-center">
        <div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">DOCUMENTARY MUSIC</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Bad Actors</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">Documentary-style releases built around evidence, conflict, accountability, and the stories behind the record.</p><Link href="/music" className="mt-7 inline-flex rounded-md bg-[#c9a84c] px-5 py-3 font-bold text-black hover:bg-[#d9bb64]">Explore Music</Link></div>
        <Image src="/images/bad-actors-cover.jpg" alt="Bad Actors album cover" width={700} height={700} className="mx-auto w-full max-w-[280px] rounded-xl border border-white/10 shadow-2xl shadow-black/60 sm:max-w-sm" />
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,#101010,#0a0a0a)]">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20"><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">STAY CONNECTED</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Book, project, music, and case updates.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">Join the update list for new investigations, product launches, American Injustice updates, music releases, and major developments from The Record.</p><FlagshipLeadForm /><div className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/updates" className="font-bold text-[#c9a84c]">Updates →</Link><Link href="/press" className="font-bold text-[#c9a84c]">Press & Media →</Link><Link href="/support" className="font-bold text-[#c9a84c]">Support →</Link><Link href="/contact" className="font-bold text-[#c9a84c]">Contact →</Link></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
