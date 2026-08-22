import type { Metadata } from "next";
import { FlagshipPage, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Support | Don Matthews",
  description: "Support independent journalism, public-record work, American Injustice, and Don Matthews' independent projects.",
  alternates: { canonical: "/support" },
};

const options = [
  ["GoFundMe", "Support the ongoing journalism and public-interest work.", "https://www.gofundme.com/f/a-journalist-fights-for-justice"],
  ["PayPal", "Direct support through the WTP News PayPal page.", "https://paypal.biz/wtpnews"],
  ["Cash App", "Direct contribution through Cash App.", "https://cash.app/$1Aaudit"],
] as const;

export default function SupportPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="SUPPORT" title="Support independent work." intro="Contributions help fund reporting, public-record acquisition, publishing, production, infrastructure, and the continued development of independent journalism and creative projects." />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {options.map(([label, detail, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-white/[0.025] p-7 text-center transition hover:-translate-y-1 hover:border-[#c9a84c]/35"><h2 className="text-2xl font-bold">{label}</h2><p className="mt-4 leading-7 text-white/50">{detail}</p><span className="mt-7 inline-block font-bold text-[#c9a84c]">Contribute →</span></a>)}
        </div>
        <div className="mt-12 rounded-xl border border-white/10 bg-[#101010] p-8"><h2 className="text-2xl font-bold">What support sustains</h2><p className="mt-4 max-w-4xl leading-8 text-white/55">Independent reporting costs money: records, travel, hosting, software, media production, publishing, and the time required to inspect source material carefully. Support helps keep that work independent and available to the public.</p></div>
      </section>
    </FlagshipPage>
  );
}
