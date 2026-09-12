import type { Metadata } from "next";
import Image from "next/image";
import { FlagshipPage, GoldButton, OutlineButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Music | Don Matthews",
  description: "Bad Actors and documentary-style music by Don Matthews: songs built from public records, civil-rights conflicts, accountability reporting, and lived experience.",
  alternates: { canonical: "/music" },
};

const featuredTracks = [
  ["Silence Ain’t Consent", "Resistance, accountability, and the cost of refusing to quietly accept the official version."],
  ["The Osteen Files (Exhibit L)", "A music-and-record crossover tied to the Galveston story and its documentary trail."],
  ["Caught Red Handed", "A direct, cinematic confrontation with the actors and conduct behind the larger record."],
  ["A Warrant For A Lie", "A song built around the collision between sworn paperwork, police narrative, and disputed facts."],
  ["Morgan County Blues", "A regional case-file song in the Bad Actors documentary tradition."],
  ["Governors Gone Too Far", "Government power, resistance, and the consequences of official overreach."],
] as const;

export default function MusicPage() {
  return (
    <FlagshipPage>
      <PageHero
        eyebrow="BAD ACTORS MUSIC"
        title="A sonic case file."
        intro="The music is part of the documentary record: original songs built around accountability, public records, civil-rights conflict, named events, and the human cost behind the headlines."
        actions={
          <div className="flex flex-wrap gap-3">
            <GoldButton href="https://badactors.online">Open BadActors.online</GoldButton>
            <OutlineButton href="https://www.wtpnews.org/category/music/">Music coverage at WTP News</OutlineButton>
          </div>
        }
      />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_15%_15%,rgba(201,168,76,0.10),transparent_32rem),#0b0a09]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-24 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div className="mx-auto w-full max-w-[470px] overflow-hidden rounded-[1.6rem] border border-[#c9a84c]/25 bg-black p-2 shadow-[0_30px_100px_rgba(0,0,0,0.62)]">
            <Image
              src="/images/bad-actors-cover.jpg"
              alt="Bad Actors Volume 1 album cover"
              width={1024}
              height={1024}
              priority
              className="h-auto w-full rounded-[1.1rem]"
            />
          </div>

          <div className="lg:pl-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c9a84c]">BAD ACTORS · VOLUME 1</p>
            <h2 className="display-serif mt-4 text-5xl font-semibold leading-[.92] tracking-[-0.04em] sm:text-7xl">Reporting that learned how to sing.</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/58 sm:text-lg">
              The current Bad Actors catalog is presented as a 17-track investigative album and digital dossier. The premise is simple: take the names, documents, contradictions, anger, and consequences that live inside the reporting and turn them into songs people will remember.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/45">
              BadActors.online remains the dedicated music destination. DonMatthews.live provides the bridge back to the journalism and public record so the art does not float free from the events that inspired it.
            </p>

            <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-xl border border-[#c9a84c]/15 bg-black/25 text-center">
              <div className="border-r border-[#c9a84c]/10 p-4 sm:p-5"><p className="text-2xl font-black text-[#d6b85c] sm:text-3xl">17</p><p className="mt-1 text-[9px] font-black uppercase tracking-[.12em] text-white/30">Tracks</p></div>
              <div className="border-r border-[#c9a84c]/10 p-4 sm:p-5"><p className="text-2xl font-black text-[#d6b85c] sm:text-3xl">Vol. 1</p><p className="mt-1 text-[9px] font-black uppercase tracking-[.12em] text-white/30">Case file</p></div>
              <div className="p-4 sm:p-5"><p className="text-2xl font-black text-[#d6b85c] sm:text-3xl">Free</p><p className="mt-1 text-[9px] font-black uppercase tracking-[.12em] text-white/30">Digital stream</p></div>
            </div>

            <div className="mt-8"><GoldButton href="https://badactors.online">Stream the full project</GoldButton></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-24">
        <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c9a84c]">FEATURED TRACKS</p>
            <h2 className="display-serif mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Songs with a paper trail.</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/50 sm:text-lg lg:justify-self-end">A few entry points into the catalog. The full release belongs at BadActors.online; related reporting and evidence stay connected through WTP News and The Record.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredTracks.map(([title, text], index) => (
            <a key={title} href="https://badactors.online" target="_blank" rel="noopener noreferrer" className="group min-h-[230px] rounded-[1.25rem] border border-white/10 bg-[linear-gradient(150deg,#14110e,#0b0a09)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40">
              <div className="flex items-center justify-between"><span className="text-[9px] font-black uppercase tracking-[.18em] text-[#c9a84c]">BAD ACTORS</span><span className="text-xs font-black text-white/15">0{index + 1}</span></div>
              <h3 className="display-serif mt-9 text-2xl font-semibold text-[#f1e5d0]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/48">{text}</p>
              <span className="mt-6 inline-block text-sm font-black text-[#d7b85d]">Listen / catalog →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:py-20 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#c9a84c]">MUSIC</p>
            <h3 className="mt-3 text-2xl font-black">BadActors.online</h3>
            <p className="mt-3 text-sm leading-7 text-white/48">The dedicated album and music destination: the place to listen and follow the Bad Actors catalog.</p>
            <a href="https://badactors.online" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-black text-[#c9a84c]">Visit music site ↗</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#c9a84c]">REPORTING</p>
            <h3 className="mt-3 text-2xl font-black">We The People News</h3>
            <p className="mt-3 text-sm leading-7 text-white/48">Stories, context, people, chronology, and public-accountability reporting that overlap with the songs.</p>
            <a href="https://www.wtpnews.org/category/music/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-black text-[#c9a84c]">Read music coverage ↗</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#c9a84c]">SOURCES</p>
            <h3 className="mt-3 text-2xl font-black">The Record</h3>
            <p className="mt-3 text-sm leading-7 text-white/48">Primary-source PDFs, case collections, filings, orders, records, and the documents behind the broader narrative.</p>
            <a href="/record" className="mt-5 inline-block text-sm font-black text-[#c9a84c]">Inspect the documents →</a>
          </div>
        </div>
      </section>
    </FlagshipPage>
  );
}
