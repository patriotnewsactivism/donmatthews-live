import type { Metadata } from "next";
import Image from "next/image";
import { FlagshipPage, GoldButton, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Music | Don Matthews",
  description: "Documentary-style music projects by Don Matthews, including Bad Actors.",
  alternates: { canonical: "/music" },
};

export default function MusicPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="MUSIC" title="Documentary music built around the story behind the record." intro="Songs and releases that turn conflict, accountability, public records, and lived experience into narrative music without separating the art from the context behind it." actions={<GoldButton href="https://badactors.online">Visit Bad Actors</GoldButton>} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <Image src="/images/bad-actors-cover.jpg" alt="Bad Actors album cover" width={900} height={900} className="w-full max-w-md rounded-xl border border-white/10 shadow-2xl shadow-black/60" />
        <div>
          <p className="text-xs font-black tracking-[0.18em] text-[#c9a84c]">FEATURED PROJECT</p>
          <h2 className="mt-3 text-5xl font-black">Bad Actors</h2>
          <p className="mt-6 text-lg leading-8 text-white/60">A documentary-style music project built around accountability, institutional conflict, public-record themes, and the people inside those stories.</p>
          <p className="mt-5 leading-8 text-white/45">The permanent catalog will give each release its own page with credits, embeds, background, related source material, and links to the reporting or record that inspired it.</p>
          <div className="mt-8"><GoldButton href="https://badactors.online">Open Bad Actors</GoldButton></div>
        </div>
      </section>
    </FlagshipPage>
  );
}
