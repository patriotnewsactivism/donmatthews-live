import Image from "next/image";
import Link from "next/link";
import FlagshipLeadForm from "@/components/FlagshipLeadForm";

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
    href: "#projects",
    cta: "Explore Projects",
  },
  {
    title: "American Injustice",
    text: "The nonfiction legal-thriller memoir and the documentary record behind it.",
    href: "#book",
    cta: "Enter the Book Hub",
  },
  {
    title: "Music",
    text: "Bad Actors and documentary-style releases built around evidence, conflict, and accountability.",
    href: "#music",
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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-black tracking-[0.18em] text-[#c9a84c]">
            DON MATTHEWS
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#book" className="hover:text-white">Book</a>
            <a href="#record" className="hover:text-white">The Record</a>
            <a href="#music" className="hover:text-white">Music</a>
            <a href="#connect" className="hover:text-white">Connect</a>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.16),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
          <div className="self-center">
            <p className="text-xs font-black tracking-[0.22em] text-[#c9a84c]">DONMATTHEWS.LIVE — OFFICIAL FLAGSHIP</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[.98] sm:text-6xl lg:text-8xl">
              Journalism. Technology. Music. The Record.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
              The central home of Don Matthews: investigative journalism, AI and software ventures,
              civil-rights advocacy, documentary music, and <em>American Injustice</em>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="rounded-md bg-[#c9a84c] px-6 py-3 font-bold text-black hover:bg-[#d9bb64]">
                Explore the Work
              </a>
              <a href="#book" className="rounded-md border border-[#c9a84c]/50 px-6 py-3 font-bold text-[#c9a84c] hover:bg-[#c9a84c]/10">
                American Injustice
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-2xl bg-[#c9a84c]/10 blur-2xl" />
            <Image
              src="/images/wanted-poster.jpg"
              alt="Don Matthews — We The People News"
              width={900}
              height={1200}
              priority
              className="relative rotate-1 rounded-xl border border-[#c9a84c]/30 shadow-2xl shadow-black/60"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <a key={pillar.title} href={pillar.href} className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#c9a84c]/40 hover:bg-white/[0.05]">
              <p className="text-xs font-black tracking-[0.16em] text-[#c9a84c]">FLAGSHIP PILLAR</p>
              <h2 className="mt-3 text-2xl font-bold">{pillar.title}</h2>
              <p className="mt-3 leading-7 text-white/55">{pillar.text}</p>
              <span className="mt-6 inline-block text-sm font-bold text-[#c9a84c]">{pillar.cta} →</span>
            </a>
          ))}
        </div>
      </section>

      <section id="projects" className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">VENTURES</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black sm:text-5xl">Featured Projects</h2>
              <p className="mt-4 max-w-2xl text-lg text-white/55">AI platforms, journalism tools, civil-rights resources, and software built for real-world use.</p>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map(([title, text, href]) => (
              <a key={title} href={href} className="rounded-xl border border-white/10 bg-[#101010] p-6 hover:border-[#c9a84c]/35">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-white/55">{text}</p>
                <span className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Visit →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE BOOK</p>
          <h2 className="mt-3 text-5xl font-black sm:text-6xl">American Injustice</h2>
        </div>
        <div>
          <p className="text-xl leading-9 text-white/65">
            A factual, first-person legal-thriller memoir built from lived experience, court records,
            recordings, public documents, and the collision between one citizen and government power.
          </p>
          <p className="mt-5 leading-8 text-white/45">
            Explore the story, source material, chronology, excerpts, and ongoing updates behind <em>American Injustice</em>.
          </p>
          <a href="https://help.donmatthews.live" className="mt-7 inline-flex rounded-md border border-[#c9a84c]/50 px-5 py-3 font-bold text-[#c9a84c] hover:bg-[#c9a84c]/10">
            Explore American Injustice
          </a>
        </div>
      </section>

      <section id="record" className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">THE RECORD</p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">Cases, filings, evidence, developments.</h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-white/60">
            <p>A date-driven public record of significant cases, hearings, filings, evidence, and major developments.</p>
            <p>The permanent archive is being structured so each significant event can have its own source material, supporting documents, related case, and permanent URL.</p>
          </div>
        </div>
      </section>

      <section id="music" className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[1fr_.8fr] lg:items-center">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">DOCUMENTARY MUSIC</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Bad Actors</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">Documentary-style releases built around evidence, conflict, accountability, and the stories behind the record.</p>
          <a href="https://badactors.online" className="mt-7 inline-flex rounded-md bg-[#c9a84c] px-5 py-3 font-bold text-black hover:bg-[#d9bb64]">Visit Bad Actors</a>
        </div>
        <Image
          src="/images/bad-actors-cover.jpg"
          alt="Bad Actors album cover"
          width={700}
          height={700}
          className="mx-auto w-full max-w-sm rounded-xl border border-white/10 shadow-2xl shadow-black/60"
        />
      </section>

      <section id="connect" className="border-t border-white/10 bg-[linear-gradient(180deg,#101010,#0a0a0a)]">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">STAY CONNECTED</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Book, project, music, and case updates.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">Join the update list for new investigations, product launches, American Injustice updates, music releases, and major developments from The Record.</p>
          <FlagshipLeadForm />
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-white/40">
        © 2026 Don Matthews. All rights reserved.
      </footer>
    </main>
  );
}
