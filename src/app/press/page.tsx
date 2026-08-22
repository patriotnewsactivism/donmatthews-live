import type { Metadata } from "next";
import Image from "next/image";
import { FlagshipPage, GoldButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Press & Media | Don Matthews",
  description: "Press bio, media topics, interview availability, and booking information for Don Matthews.",
  alternates: { canonical: "/press" },
};

const topics = ["Investigative journalism", "Government accountability", "AI systems and autonomous agents", "Independent software building", "Civil-rights reporting", "American Injustice", "Documentary music"];

export default function PressPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="PRESS & MEDIA" title="Bio, topics, bookings, and media inquiries." intro="A clean destination for journalists, podcasters, producers, and collaborators looking for background, commentary, interviews, or project information." actions={<GoldButton href="mailto:press@wtpnews.org">press@wtpnews.org</GoldButton>} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <Image src="/images/portrait-bw.jpg" alt="Don Matthews press portrait" width={960} height={960} className="w-full max-w-md rounded-xl border border-white/10 grayscale" />
        <div>
          <h2 className="text-3xl font-black">Short bio</h2>
          <p className="mt-5 text-lg leading-8 text-white/60">Don Matthews is an investigative journalist, AI and software builder, author, songwriter, and civil-rights advocate. His work spans independent reporting through We The People News, autonomous AI systems and software products, the nonfiction project <em>American Injustice</em>, and documentary-style music.</p>
          <h2 className="mt-10 text-2xl font-bold">Topics</h2>
          <div className="mt-4 flex flex-wrap gap-2">{topics.map(topic => <span key={topic} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/60">{topic}</span>)}</div>
          <div className="mt-10 rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.05] p-7"><h2 className="text-2xl font-bold">Bookings & inquiries</h2><p className="mt-3 leading-7 text-white/55">For interviews, expert commentary, podcast bookings, licensing, or media requests.</p><a href="mailto:press@wtpnews.org" className="mt-5 inline-block font-bold text-[#c9a84c]">press@wtpnews.org →</a></div>
        </div>
      </section>
    </FlagshipPage>
  );
}
