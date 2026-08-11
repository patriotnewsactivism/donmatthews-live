"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, PlayCircle, FileWarning } from "lucide-react";

// Dated update banner — keep this in sync with the American Injustice
// manuscript and wtpnews.org reporting. Update the `updated` string and
// the two cards below when there's a real docket/procedural development;
// don't leave stale dates sitting here.
export default function BreakingUpdate() {
  return (
    <section className="relative bg-[#120a0a] border-b border-red-900/30 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
          <AlertTriangle className="w-4 h-4" />
          <span>Latest Case Developments &mdash; Updated August 11, 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 — Sentencing hearing recording published */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-start gap-3 mb-3">
              <PlayCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
              <h3 className="text-white font-bold text-lg leading-snug">
                Sentencing Hearing Recording Now Public
              </h3>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              The August 7, 2026 federal sentencing hearing in{" "}
              <em>United States v. Reardon</em>, 6:25-cr-00227 (W.D. La.), held by
              secure video link, is now published in full. The hearing resulted in
              time served plus two years unsupervised probation and a Louisiana
              federal-courthouse restriction. The 14-day appeal window that began
              running at entry of judgment is the current live procedural issue.
            </p>
            <a
              href="https://wtpnews.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-gold-light hover:text-gold text-sm font-semibold underline underline-offset-4"
            >
              Read the coverage on We The People News &rarr;
            </a>
          </div>

          {/* Card 2 — Galveston civil case dismissed */}
          <div className="p-6 rounded-xl border border-red-900/40 bg-red-950/10">
            <div className="flex items-start gap-3 mb-3">
              <FileWarning className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
              <h3 className="text-white font-bold text-lg leading-snug">
                Reardon v. Osteen (Galveston) Dismissed &mdash; Judgment Withheld
              </h3>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              On August 10, 2026, Reardon learned that his federal civil-rights case
              against Galveston, TX officials, Officer William Osteen, Sergeant Jack
              Doraty, and the Mississippi-side defendants &mdash; <em>Reardon v.
              Osteen</em>, No. 3:25-cv-00203 (S.D. Tex.) &mdash; was dismissed in its
              entirety, over his timely written objections to the magistrate&rsquo;s
              July 14, 2026 recommendation. As of publication, the court has not
              served him with the district judge&rsquo;s written order or final
              judgment, so the specific rulings on each of his nine objections are
              not yet known to him. He is treating the failure to serve the order as
              a serious transparency problem in a case already built on a documented
              admission that the arresting officer misrepresented what he smelled at
              the scene. This section will be corrected with the judge&rsquo;s actual
              language the moment it is served.
            </p>
            <a
              href="https://wtpnews.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-red-300 hover:text-red-200 text-sm font-semibold underline underline-offset-4"
            >
              Follow the docket fight &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
