import Image from "next/image";
import Link from "next/link";
import AmericanInjusticeBanner from "@/components/AmericanInjusticeBanner";
import AllocutionVideo from "@/components/AllocutionVideo";
import CaughtRedHandedVideo from "@/components/CaughtRedHandedVideo";
import FlagshipLeadForm from "@/components/FlagshipLeadForm";
import { LatestArticlesSection } from "@/components/LatestArticlesSection";
import { SiteFooter } from "@/components/FlagshipShell";

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
    <main className="w-full min-h-screen bg-[#0a0a0a] text-white p-0 m-0">
      {/* 
        Full-bleed top banner: Replaces SiteHeader and old Hero.
        Touches the top, far left, and far right on all screens.
      */}
      <AmericanInjusticeBanner />

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

      <section className="border-b border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-14 sm:gap-10 sm:py-20 lg:grid-cols-2"><div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE RECORD</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Cases, filings, evidence, conflicts.</h2></div><div className="space-y-4 text-base leading-8 text-white/60 sm:text-lg"><p>A source-first public archive that distinguishes documents, allegations, court findings, unresolved conflicts, and editorial corrections.</p><Link href="/record" className="inline-block font-bold text-[#c9a84c]">Open The Record →</Link></div></div>
      </section>

      <AllocutionVideo />

      <LatestArticlesSection />

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:gap-10 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-center">
        <div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">DOCUMENTARY MUSIC</p><h2 className="display-serif mt-3 text-4xl font-semibold sm:text-6xl">Bad Actors</h2><p className="mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">Documentary-style releases built around evidence, conflict, accountability, and the stories behind the record.</p><Link href="/music" className="gold-action mt-7 inline-flex rounded-lg px-5 py-3 font-black text-black transition hover:-translate-y-0.5">Explore Music</Link></div>
        <div className="premium-card mx-auto w-full max-w-[280px] rounded-2xl border border-[#c9a84c]/20 bg-[#0d0d0d] p-2 shadow-2xl shadow-black/60 sm:max-w-sm"><Image src="/images/bad-actors-cover.jpg" alt="Bad Actors album cover" width={1024} height={1024} className="w-full rounded-xl" /></div>
      </section>

      <CaughtRedHandedVideo />

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,#101010,#0a0a0a)]">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20"><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">STAY CONNECTED</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Book, project, music, and case updates.</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">Join the update list for new investigations, product launches, American Injustice updates, music releases, and major developments from The Record.</p><FlagshipLeadForm /><div className="mt-8 flex flex-wrap gap-4 text-sm"><Link href="/updates" className="font-bold text-[#c9a84c]">Updates →</Link><Link href="/press" className="font-bold text-[#c9a84c]">Press & Media →</Link><Link href="/support" className="font-bold text-[#c9a84c]">Support →</Link><Link href="/contact" className="font-bold text-[#c9a84c]">Contact →</Link></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}