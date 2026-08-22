import Image from "next/image";
import Link from "next/link";
import FlagshipLeadForm from "@/components/FlagshipLeadForm";
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

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.16),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-11 sm:gap-10 sm:py-16 lg:grid-cols-[1.2fr_.8fr] lg:gap-12 lg:py-28">
          <div className="self-center">
            <p className="text-[10px] font-black tracking-[0.18em] text-[#c9a84c] sm:text-xs sm:tracking-[0.22em]">DONMATTHEWS.LIVE — OFFICIAL FLAGSHIP</p>
            <h1 className="mt-3 max-w-4xl text-[2.35rem] font-black leading-[.96] tracking-[-0.035em] sm:mt-5 sm:text-6xl sm:tracking-normal lg:text-8xl">Journalism. Technology. Music. The Record.</h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/65 sm:mt-7 sm:text-xl sm:leading-8">The central home of Don Matthews: investigative journalism, AI and software ventures, civil-rights advocacy, documentary music, and <em>American Injustice</em>.</p>
            <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <Link href="/projects" className="rounded-md bg-[#c9a84c] px-5 py-3 text-center text-sm font-bold text-black hover:bg-[#d9bb64] sm:px-6 sm:text-base">Explore the Work</Link>
              <Link href="/american-injustice" className="rounded-md border border-[#c9a84c]/50 px-5 py-3 text-center text-sm font-bold text-[#c9a84c] hover:bg-[#c9a84c]/10 sm:px-6 sm:text-base">American Injustice</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[270px] sm:max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-2xl bg-[#c9a84c]/10 blur-2xl" />
            <Image src="/images/wanted-poster.jpg" alt="Don Matthews — We The People News" width={900} height={1200} priority className="relative rotate-1 rounded-xl border border-[#c9a84c]/30 shadow-2xl shadow-black/60" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => pillar.href.startsWith("http") ? (
            <a key={pillar.title} href={pillar.href} target="_blank" rel="noopener noreferrer" className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#c9a84c]/40 hover:bg-white/[0.05]"><p className="text-xs font-black tracking-[0.16em] text-[#c9a84c]">FLAGSHIP PILLAR</p><h2 className="mt-3 text-2xl font-bold">{pillar.title}</h2><p className="mt-3 leading-7 text-white/55">{pillar.text}</p><span className="mt-6 inline-block text-sm font-bold text-[#c9a84c]">{pillar.cta} →</span></a>
          ) : (
            <Link key={pillar.title} href={pillar.href} className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#c9a84c]/40 hover:bg-white/[0.05]"><p className="text-xs font-black tracking-[0.16em] text-[#c9a84c]">FLAGSHIP PILLAR</p><h2 className="mt-3 text-2xl font-bold">{pillar.title}</h2><p className="mt-3 leading-7 text-white/55">{pillar.text}</p><span className="mt-6 inline-block text-sm font-bold text-[#c9a84c]">{pillar.cta} →</span></Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">VENTURES</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h2 className="text-3xl font-black sm:text-5xl">Featured Projects</h2><p className="mt-4 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">AI platforms, journalism tools, civil-rights resources, and software built for real-world use.</p></div><Link href="/projects" className="font-bold text-[#c9a84c]">View all projects →</Link></div>
          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">{projects.map(([title, text, href]) => <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-[#101010] p-6 hover:border-[#c9a84c]/35"><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 leading-7 text-white/55">{text}</p><span className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Visit →</span></a>)}</div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-14 sm:gap-10 sm:py-24 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE BOOK</p><h2 className="mt-3 text-4xl font-black sm:text-6xl">American Injustice</h2></div>
        <div><p className="text-lg leading-8 text-white/65 sm:text-xl sm:leading-9">A factual, first-person legal-thriller memoir built from lived experience, court records, recordings, public documents, and the collision between one citizen and government power.</p><p className="mt-5 leading-8 text-white/45">The current publication build spans 39 chapters and pairs the narrative with an organized public source archive.</p><Link href="/american-injustice" className="mt-7 inline-flex rounded-md border border-[#c9a84c]/50 px-5 py-3 font-bold text-[#c9a84c] hover:bg-[#c9a84c]/10">Explore American Injustice</Link></div>
      </section>

      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-14 sm:gap-10 sm:py-20 lg:grid-cols-2"><div><p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE RECORD</p><h2 className="mt-3 text-3xl font-black sm:text-5xl">Cases, filings, evidence, conflicts.</h2></div><div className="space-y-4 text-base leading-8 text-white/60 sm:text-lg"><p>A source-first public archive that distinguishes documents, allegations, court findings, unresolved conflicts, and editorial corrections.</p><Link href="/record" className="inline-block font-bold text-[#c9a84c]">Open The Record →</Link></div></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:py-20">
        <div className="rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.045] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">LATEST UPDATE · AUGUST 22, 2026</p>
              <h2 className="mt-3 text-2xl font-black sm:text-4xl">The manuscript and source record just completed another prepublication integration pass.</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">The latest source packet records new documents, corrections, preserved record conflicts, and a publication build of approximately 78,920 words and 291 pages.</p>
            </div>
            <Link href="/updates" className="rounded-md bg-[#c9a84c] px-5 py-3 text-center font-bold text-black hover:bg-[#d9bb64]">View Updates</Link>
          </div>
        </div>
      </section>

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
