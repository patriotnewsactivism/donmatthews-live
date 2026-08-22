import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FlagshipPage, GoldButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Press & Media | Don Matthews",
  description: "Press bio, media topics, interview availability, attribution guidance, and booking information for Don Matthews.",
  alternates: { canonical: "/press" },
};

const topics = [
  "Investigative journalism",
  "Government accountability",
  "AI systems and autonomous agents",
  "Independent software building",
  "Civil-rights reporting",
  "American Injustice",
  "Documentary music",
];

const mediaLinks = [
  ["We The People News", "Independent reporting and newsroom work.", "https://wtpnews.org"],
  ["American Injustice", "Book, source archive, publication structure, and editorial method.", "/american-injustice"],
  ["The Record", "Public source archive and record-label methodology.", "/record"],
  ["Technology & AI", "Autonomous-agent systems, legal technology, and software portfolio.", "/technology"],
  ["Projects", "Current live, beta, and in-development ventures.", "/projects"],
  ["Music", "Bad Actors and documentary-style releases.", "/music"],
] as const;

export default function PressPage() {
  return (
    <FlagshipPage>
      <PageHero
        eyebrow="PRESS & MEDIA"
        title="Bio, topics, bookings, and source links."
        intro="A working media kit for journalists, podcasters, producers, collaborators, and anyone looking for background, commentary, interviews, or project information."
        actions={<GoldButton href="mailto:press@wtpnews.org">press@wtpnews.org</GoldButton>}
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div>
          <Image src="/images/portrait-bw.jpg" alt="Don Matthews press portrait" width={960} height={960} className="w-full max-w-md rounded-xl border border-white/10 grayscale" />
          <p className="mt-3 max-w-md text-xs leading-5 text-white/35">Press portrait currently used by the flagship. Contact the media address for alternate assets or licensing questions.</p>
        </div>

        <div>
          <p className="text-xs font-black tracking-[0.18em] text-[#c9a84c]">SHORT BIO</p>
          <p className="mt-4 text-xl leading-9 text-white/65">Don Matthews is an investigative journalist, AI and software builder, author, songwriter, and civil-rights advocate. His work spans independent reporting through We The People News, autonomous AI systems and software products, the nonfiction project <em>American Injustice</em>, and documentary-style music.</p>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.025] p-6">
            <p className="text-xs font-black tracking-[0.16em] text-[#c9a84c]">SUGGESTED ATTRIBUTION</p>
            <p className="mt-3 text-lg leading-8 text-white/60">Don Matthews — investigative journalist, AI/software builder, and author of <em>American Injustice</em>.</p>
          </div>

          <h2 className="mt-10 text-2xl font-bold">Interview & commentary topics</h2>
          <div className="mt-4 flex flex-wrap gap-2">{topics.map(topic => <span key={topic} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/60">{topic}</span>)}</div>

          <div className="mt-10 rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.05] p-7"><h2 className="text-2xl font-bold">Bookings & inquiries</h2><p className="mt-3 leading-7 text-white/55">For interviews, commentary, podcast bookings, licensing, or media requests.</p><a href="mailto:press@wtpnews.org" className="mt-5 inline-block font-bold text-[#c9a84c]">press@wtpnews.org →</a></div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs font-black tracking-[0.2em] text-[#c9a84c]">BACKGROUND & SOURCE ROUTING</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Go straight to the relevant body of work.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mediaLinks.map(([title, text, href]) => {
              const external = href.startsWith("http");
              const body = <><h3 className="text-2xl font-bold">{title}</h3><p className="mt-3 leading-7 text-white/50">{text}</p><span className="mt-5 inline-block text-sm font-bold text-[#c9a84c]">Open →</span></>;
              return external ? <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-black/25 p-6 hover:border-[#c9a84c]/35">{body}</a> : <Link key={title} href={href} className="rounded-xl border border-white/10 bg-black/25 p-6 hover:border-[#c9a84c]/35">{body}</Link>;
            })}
          </div>
        </div>
      </section>
    </FlagshipPage>
  );
}
