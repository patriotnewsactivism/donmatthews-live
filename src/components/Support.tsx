"use client";

import React from "react";
import { Heart, ExternalLink } from "lucide-react";

const options = [
  {
    label: "GoFundMe",
    detail: "Veteran in Crisis Needs Your Help",
    href: "https://www.gofundme.com/f/a-journalist-fights-for-justice",
  },
  {
    label: "PayPal",
    detail: "paypal.biz/wtpnews",
    href: "https://paypal.biz/wtpnews",
  },
  {
    label: "Cash App",
    detail: "$Aaudit",
    href: "https://cash.app/$Aaudit",
  },
];

export default function Support() {
  return (
    <section id="support" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative Grid Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <Heart className="w-4 h-4" />
            <span>Support The Fight</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Help Me Keep Going
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 font-light">
            I&apos;m representing myself pro se in an active federal civil rights case, traveling
            between Mississippi, Louisiana, and Texas for court with no vehicle of my own. Every
            dollar goes straight to legal filings, records requests, and survival — not to anyone
            else. Read the full story at{" "}
            <a
              href="https://help.donmatthews.live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light underline underline-offset-4"
            >
              help.donmatthews.live
            </a>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {options.map((opt) => (
            <a
              key={opt.label}
              href={opt.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-gold/30 transition-all flex flex-col items-center text-center gap-2"
            >
              <span className="text-lg font-bold text-white group-hover:text-gold transition-colors">
                {opt.label}
              </span>
              <span className="text-sm text-gray-500">{opt.detail}</span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-light group-hover:text-gold transition-colors">
                Donate now
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
