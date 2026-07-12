"use client";

import React from "react";
import { Mail, Shield } from "lucide-react";
import Image from "next/image";

export default function Press() {
  const roles = [
    "Software Developer",
    "AI Architect",
    "Investigative Journalist",
    "Civil Rights Litigant",
    "Musician",
    "Author"
  ];

  return (
    <section id="press" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute right-1/4 bottom-10 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <Shield className="w-4 h-4" />
            <span>Media Kit</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Press & Media
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Portrait */}
          <div className="md:col-span-5 md:order-2">
            <div className="relative w-full max-w-sm mx-auto aspect-square rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
              <Image
                src="/images/portrait-bw.jpg"
                alt="Don Matthews — Matthew Reardon"
                fill
                className="object-cover grayscale"
              />
            </div>
          </div>

          {/* Bio Info */}
          <div className="md:col-span-7 md:order-1 space-y-6">
            <h3 className="text-2xl font-bold text-white">Press Bio</h3>
            <p className="text-gray-300 font-light leading-relaxed">
              Don Matthews is an entrepreneur, AI systems architect, songwriter, and tireless civil rights advocate.
              Combining deep expertise in cutting-edge software development with an active pro se litigation background,
              Don directly challenges systemic civil rights issues and constitutional infractions.
            </p>
            <p className="text-gray-400 font-light leading-relaxed">
              As director of independent journalism site We The People News, Don champions government transparency
              and First Amendment audits — bringing real-world legal action and investigative research together
              with music production to highlight human stories.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {roles.map((role) => (
                <span key={role} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Cards */}
          <div className="md:col-span-12 md:order-3 p-8 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent text-center space-y-6 max-w-xl mx-auto">
            <div className="p-4 bg-gold/10 rounded-full w-fit mx-auto text-gold">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Bookings & Inquiries</h4>
              <p className="text-xs text-gray-400 font-light mb-6">
                For media inquiries, expert commentary, podcast bookings, or licensing questions.
              </p>
              <a
                href="mailto:press@wtpnews.org"
                className="inline-flex items-center justify-center w-full py-3 px-6 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg text-sm transition-colors duration-300"
              >
                press@wtpnews.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
