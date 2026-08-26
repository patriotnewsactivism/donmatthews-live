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
    <main className="site-shell min-h-screen bg-[#0a0a0a] text-white">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-[#c9a84c]/15 bg-[#080808]">
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_78%_18%,rgba(201,168,76,0.2),transparent_30%),radial-gradient(circle_at_12%_78%,rgba(201,168,76,0.07),transparent_28%)]" />
        <div className="absolute inset-0 -z-20 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute -right-16 top-16 -z-10 h-56 w-56 rounded-full border border-[#c9a84c]/10 sm:h-80 sm:w-80" />
        <div className="absolute -right-3 top-28 -z-10 h-32 w-32 rounded-full border border-[#c9a84c]/10 sm:h-52 sm:w-52" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-9 sm:gap-10 sm:py-16 lg:min-h-[calc(100svh-66px)] lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:gap-14 lg:py-20">
          <div className="self-center">
            <Link href="/american-injustice" className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/25 bg-[#c9a84c]/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#c9a84c] transition hover:bg-[#c9a84c]/10 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c] shadow-[0_0_12px_rgba(201,168,76,0.9)]" />
              American Injustice pre-orders open
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#c9a84c] sm:w-12" />
              <p className="text-[9px] font-black tracking-[0.22em] text-[#c9a84c] sm:text-xs sm:tracking-[0.24em]">DONMATTHEWS.LIVE · OFFICIAL FLAGSHIP</p>
            </div>

            <h1 className="mt-4 max-w-4xl text-[2.2rem] font-black leading-[.92] tracking-[-0.045em] text-[#f8f5ed] [text-wrap:balance] sm:mt-5 sm:text-6xl sm:tracking-normal lg:text-[5.25rem] xl:text-8xl">
              <span className="block">Journalism.</span>
              <span className="block text-white/72">Technology.</span>
              <span className="block text-[#c9a84c]">Music. <span className="display-serif font-semibold italic tracking-[-0.02em] text-white">The Record.</span></span>
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/58 sm:mt-7 sm:max-w-2xl sm:text-xl sm:leading-8">Independent work spanning investigative journalism, AI and software, civil-rights advocacy, documentary music, and <em>American Injustice</em>.</p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <Link href="/projects" className="gold-action rounded-lg px-4 py-3 text-center text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 sm:px-6 sm:text-base">Explore the Work</Link>
              <Link href="/american-injustice" className="outline-action rounded-lg border border-[#c9a84c]/40 bg-black/20 px-4 py-3 text-center text-sm font-black text-[#d6b95f] transition duration-300 hover:-translate-y-0.5 hover:bg-[#c9a84c]/10 sm:px-6 sm:text-base">The Book</Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 sm:text-xs">
              <span>Journalism</span><span>AI & Software</span><span>Author</span><span>Music</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-[520px]">
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-[#c9a84c]/[0.08] blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#c9a84c]/25 bg-[#080808] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
              <Image src="/images/wanted-poster.jpg" alt="Don Matthews — We The People News" width={1024} height={1536} priority className="h-auto w-full object-contain" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_68%,rgba(5,5,5,0.72)_100%)]" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 text-[9px] font-black uppercase tracking-[0.16em] text-white/34">
              <span>Field record · WTP News</span><span className="text-[#c9a84c]">Full document view</span>
            </div>
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
            <a key={pillar.title} href={pillar.href} target="_blank" rel="noopener noreferrer" className="premium-card group min-w-[82vw] snap-center rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.012))] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40 md:min-w-0">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black tracking-[0.16em] text-[#c9a84c]">FLAGSHIP PILLAR</p><span className="text-xs font-black text-white/20">0{index + 1}</span></div><h2 className="mt-4 text-2xl font-black">{pillar.title}</h2><p className="mt-3 leading-7 text-white/50">{pillar.text}</p><span className="mt-7 inline-block text-sm font-bold text-[#c9a84c]">{pillar.cta} →</span>
            </a>
          ) : (
            <Link key={pillar.title} href={pillar.href} className="premium-card group min-w-[82vw] snap-center rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.012))] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40 md:min-w-0">
              <div className="flex items-center justify-between"><p className="text-[10px] font-black tracking-[0.16em] text-[#c9a84c]">FLAGSHIP PILLAR</p><span className="text-xs font-black text-white/20">0{index + 1}</span></div><h2 className="mt-4 text-2xl font-black">{pillar.title}</h2><p className="mt-3 leading-7 text-white/50">{pillar.text}</p><span className="mt-7 inline-block text-sm font-bold text-[#c9a84c]">{pillar.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">VENTURES</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h2 className="text-3xl font-black sm:text-5xl">Featured Projects</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">AI platforms, journalism tools, civil-rights resources, and software built for real-world use.</p></div><Link href="/projects" className="font-bold text-[#c9a84c]">View all projects →</Link></div>
          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">{projects.map(([title, text, href], index) => <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="premium-card group rounded-xl border border-white/10 bg-[linear-gradient(150deg,#121211,#0c0c0c)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/35"><div className="flex items-start justify-between gap-4"><h3 className="text-xl font-bold">{title}</h3><span className="text-[10px] font-black tracking-[0.15em] text-[#c9a84c]/45">0{index + 1}</span></div><p className="mt-3 leading-7 text-white/52">{text}</p><span className="mt-5 inline-block text-sm font-bold text-[#c9a84c] transition group-hover:translate-x-1">Visit →</span></a>)}</div>
        </div>
      </section>

      <section className="book-campaign relative overflow-hidden border-y border-[#c9a84c]/15 bg-[#070706]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,168,76,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.012),transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-20 lg:py-28">
          <div className="mx-auto w-full max-w-[250px] sm:max-w-[310px] lg:max-w-[360px]">
            <div className="relative rounded-[1.25rem] border border-[#c9a84c]/30 bg-black/70 p-2 shadow-[0_36px_90px_rgba(0,0,0,0.6)]">
              <Image src="/images/american-injustice-cover.svg" alt="American Injustice book cover" width={1600} height={2560} unoptimized className="h-auto w-full rounded-[.85rem] object-contain" />
            </div>
          </div>
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#c9a84c] sm:text-xs">The book · Pre-orders open</p>
            <h2 className="display-serif mt-4 text-[2.8rem] font-semibold leading-[.92] tracking-[-0.04em] text-[#f0e7d0] sm:text-6xl lg:text-7xl">American Injustice</h2>
            <p className="display-serif mt-3 text-xl italic text-[#c9a84c] sm:text-2xl">A Memoir of Constitutional Warfare</p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">A factual, first-person legal-thriller memoir built from lived experience, court records, recordings, public documents, and the collision between one citizen and government power.</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-y border-white/10 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/42"><span>Paperback $25.99</span><span>Hardback $35.99</span><span>Audiobook $15</span><span>eBook with donation</span></div>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap"><Link href="/american-injustice" className="gold-action rounded-lg px-6 py-3.5 text-center text-sm font-black text-black transition hover:-translate-y-0.5 sm:text-base">Pre-order / Join Updates</Link><Link href="/record" className="outline-action rounded-lg border border-[#c9a84c]/30 bg-black/25 px-6 py-3.5 text-center text-sm font-bold text-[#e0c66f] transition hover:-translate-y-0.5 hover:border-[#c9a84c]/60 sm:text-base">Inspect The Record</Link></div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-14 sm:gap-10 sm:py-20 lg:grid-cols-2"><div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE RECORD</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Cases, filings, evidence, conflicts.</h2></div><div className="space-y-4 text-base leading-8 text-white/60 sm:text-lg"><p>A source-first public archive that distinguishes documents, allegations, court findings, unresolved conflicts, and editorial corrections.</p><Link href="/record" className="inline-block font-bold text-[#c9a84c]">Open The Record →</Link></div></div>
      </section>

      <LatestArticlesSection />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:gap-10 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-center">
        <div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">DOCUMENTARY MUSIC</p><h2 className="display-serif mt-3 text-4xl font-semibold sm:text-6xl">Bad Actors</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">Documentary-style releases built around evidence, conflict, accountability, and the stories behind the record.</p><Link href="/music" className="gold-action mt-7 inline-flex rounded-lg px-5 py-3 font-black text-black transition hover:-translate-y-0.5">Explore Music</Link></div>
        <div className="premium-card mx-auto w-full max-w-[280px] rounded-2xl border border-[#c9a84c]/20 bg-[#0d0d0d] p-2 shadow-2xl shadow-black/60 sm:max-w-sm"><Image src="/images/bad-actors-cover.jpg" alt="Bad Actors album cover" width={1024} height={1024} className="w-full rounded-xl" /></div>
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,#101010,#0a0a0a)]">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20"><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">STAY CONNECTED</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Book, project, music, and case updates.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">Join the update list for new investigations, product launches, American Injustice updates, music releases, and major developments from The Record.</p><FlagshipLeadForm /><div className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/updates" className="font-bold text-[#c9a84c]">Updates →</Link><Link href="/press" className="font-bold text-[#c9a84c]">Press & Media →</Link><Link href="/support" className="font-bold text-[#c9a84c]">Support →</Link><Link href="/contact" className="font-bold text-[#c9a84c]">Contact →</Link></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
