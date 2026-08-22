import type { Metadata } from "next";
import { FlagshipLeadForm } from "@/components/FlagshipLeadForm";
import { FlagshipPage, PageHero } from "@/components/FlagshipShell";

export const metadata: Metadata = {
  title: "Contact | Don Matthews",
  description: "Contact Don Matthews for media, project, collaboration, and update inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <FlagshipPage>
      <PageHero eyebrow="CONTACT" title="Media, projects, collaboration, and updates." intro="Use the media address for interviews and press. For broader updates, join the retained update list below." />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-20 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-8">
          <p className="text-xs font-black tracking-[0.18em] text-[#c9a84c]">MEDIA & BOOKINGS</p>
          <h2 className="mt-3 text-3xl font-black">Press inquiries</h2>
          <p className="mt-4 leading-8 text-white/55">For interviews, commentary, podcast appearances, licensing, and media requests.</p>
          <a href="mailto:press@wtpnews.org" className="mt-7 inline-block font-bold text-[#c9a84c]">press@wtpnews.org →</a>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-8">
          <p className="text-xs font-black tracking-[0.18em] text-[#c9a84c]">UPDATES</p>
          <h2 className="mt-3 text-3xl font-black">Stay connected</h2>
          <p className="mt-4 leading-8 text-white/55">Get major project, book, music, journalism, and public-record updates.</p>
          <FlagshipLeadForm />
        </div>
      </section>
    </FlagshipPage>
  );
}
