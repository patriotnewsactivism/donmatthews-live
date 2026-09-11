"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, BookText, Tablet, Shield, Scale, Star, Feather, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero_header_interest" }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hero" className="relative w-full bg-[#0a0a0a] text-[#f5eedb] overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP & TABLET: Pixel-Aligned Interactive Overlay over your graphic */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative w-full max-w-[1920px] mx-auto select-none">
        {/* Base Header Graphic */}
        <div className="relative w-full aspect-[16/9]">
          <Image
            src="/images/american-injustice-desktop.jpg"
            alt="American Injustice - Don Matthews"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />

          {/* --- TOP NAVIGATION HOTSPOTS --- */}
          <div className="absolute top-[2.4%] right-[2.2%] h-[5.2%] flex items-center gap-2 lg:gap-4 z-20 text-[11px] lg:text-xs tracking-wider uppercase font-serif">
            <Link
              href="/about"
              className="text-transparent hover:text-amber-200/90 hover:bg-black/30 px-2 py-1 rounded transition-colors"
              title="About Don"
            >
              About Don
            </Link>
            <Link
              href="/american-injustice"
              className="text-transparent hover:text-amber-200/90 hover:bg-black/30 px-2 py-1 rounded transition-colors"
              title="The Book"
            >
              The Book
            </Link>
            <Link
              href="/press"
              className="text-transparent hover:text-amber-200/90 hover:bg-black/30 px-2 py-1 rounded transition-colors"
              title="Media"
            >
              Media
            </Link>
            <Link
              href="/updates"
              className="text-transparent hover:text-amber-200/90 hover:bg-black/30 px-2 py-1 rounded transition-colors"
              title="Updates"
            >
              Updates
            </Link>
            <Link
              href="/contact"
              className="text-transparent hover:text-amber-200/90 hover:bg-black/30 px-2 py-1 rounded transition-colors"
              title="Contact"
            >
              Contact
            </Link>
            <a
              href="#preorder-section"
              className="w-[115px] lg:w-[130px] h-[32px] rounded border border-transparent hover:border-amber-400 hover:bg-amber-400/10 transition-all cursor-pointer"
              title="Pre-Order Now"
            />
          </div>

          {/* --- 3 PRE-ORDER BUTTONS --- */}
          <div className="absolute top-[58.5%] left-[3.9%] w-[40.5%] h-[9.5%] z-20 grid grid-cols-3 gap-[2.5%]">
            <a
              href="#preorder-paperback"
              title="Pre-Order Paperback"
              className="w-full h-full rounded border border-transparent hover:border-amber-400/80 hover:bg-amber-400/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all cursor-pointer"
            />
            <a
              href="#preorder-hardcover"
              title="Pre-Order Hardcover"
              className="w-full h-full rounded border border-transparent hover:border-amber-400/80 hover:bg-amber-400/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all cursor-pointer"
            />
            <a
              href="#preorder-ebook"
              title="Pre-Order eBook"
              className="w-full h-full rounded border border-transparent hover:border-amber-400/80 hover:bg-amber-400/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all cursor-pointer"
            />
          </div>

          {/* --- EMAIL SIGNUP FORM OVERLAY --- */}
          <div className="absolute top-[74.0%] left-[10.2%] w-[33.5%] h-[6.0%] z-20 flex items-center">
            {submitted ? (
              <div className="w-full h-full flex items-center justify-center gap-2 bg-[#120f0a] border border-emerald-500/60 rounded text-emerald-400 text-xs font-serif">
                <CheckCircle2 className="w-4 h-4" />
                <span>You&apos;re on the interest list. Check your inbox for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full h-full flex items-center gap-[2%]">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-[58%] h-full bg-[#100d08]/80 text-[#f5eedb] text-xs lg:text-sm px-3 rounded border border-amber-500/30 focus:border-amber-400 focus:bg-[#100d08] focus:outline-none transition-colors placeholder-[#837865]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-[40%] h-full bg-amber-400/90 hover:bg-amber-300 active:scale-[0.99] text-black font-bold text-[10px] lg:text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md"
                >
                  {loading ? "Joining..." : "Join The Interest List"}
                </button>
              </form>
            )}
          </div>

          {/* --- BOTTOM 4 FEATURE PILLARS HOTSPOTS --- */}
          <div className="absolute top-[86.5%] left-[2.8%] w-[54.0%] h-[11.5%] z-20 grid grid-cols-4 gap-2">
            <Link
              href="/about"
              title="A True Story - A Marine's Promise"
              className="w-full h-full rounded border border-transparent hover:border-amber-500/30 hover:bg-amber-400/5 transition-colors cursor-pointer"
            />
            <Link
              href="/american-injustice"
              title="Constitutional Warfare - Restoring Truth"
              className="w-full h-full rounded border border-transparent hover:border-amber-500/30 hover:bg-amber-400/5 transition-colors cursor-pointer"
            />
            <Link
              href="/record"
              title="Three Federal Cases - MS, UT, TX"
              className="w-full h-full rounded border border-transparent hover:border-amber-500/30 hover:bg-amber-400/5 transition-colors cursor-pointer"
            />
            <a
              href="https://help.donmatthews.live"
              target="_blank"
              rel="noopener noreferrer"
              title="A Call to Stand - Support & Action"
              className="w-full h-full rounded border border-transparent hover:border-amber-500/30 hover:bg-amber-400/5 transition-colors cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE RESPONSIVE FALLBACK: Full legibility & large touch targets     */}
      {/* ========================================================================= */}
      <div className="block md:hidden px-4 py-8 bg-[#0d0b08] border-b border-[#31291d]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs tracking-widest uppercase font-serif mb-2">
            <span>★</span>
            <span>Pre-Order</span>
            <span>★</span>
          </div>
          <h1 className="text-3xl font-extrabold font-serif uppercase tracking-tight text-[#f4ebdc]">
            American Injustice
          </h1>
          <p className="text-base text-amber-200/90 font-serif italic mt-1">
            A Memoir of Constitutional Warfare
          </p>
          <p className="text-xs text-[#b8ad96] mt-3 leading-relaxed">
            Reserve your copy and join the updates list for launch news, excerpts, and release announcements.
          </p>
        </div>

        {/* 3 Mobile Format Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <a
            href="#preorder-paperback"
            className="flex flex-col items-center justify-center p-2.5 rounded border border-amber-500/40 bg-[#16120c] hover:border-amber-400 active:bg-amber-400/20 text-center"
          >
            <BookOpen className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[9px] uppercase tracking-wider text-amber-200/70">Pre-Order</span>
            <span className="text-[11px] uppercase font-bold text-[#f5eedb]">Paperback</span>
          </a>
          <a
            href="#preorder-hardcover"
            className="flex flex-col items-center justify-center p-2.5 rounded border border-amber-500/40 bg-[#16120c] hover:border-amber-400 active:bg-amber-400/20 text-center"
          >
            <BookText className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[9px] uppercase tracking-wider text-amber-200/70">Pre-Order</span>
            <span className="text-[11px] uppercase font-bold text-[#f5eedb]">Hardcover</span>
          </a>
          <a
            href="#preorder-ebook"
            className="flex flex-col items-center justify-center p-2.5 rounded border border-amber-500/40 bg-[#16120c] hover:border-amber-400 active:bg-amber-400/20 text-center"
          >
            <Tablet className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[9px] uppercase tracking-wider text-amber-200/70">Pre-Order</span>
            <span className="text-[11px] uppercase font-bold text-[#f5eedb]">eBook</span>
          </a>
        </div>

        {/* Mobile Lead Form */}
        <div className="p-4 rounded border border-amber-500/30 bg-[#14100b] mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-serif font-medium text-amber-200">
              Get updates and early access
            </span>
          </div>

          {submitted ? (
            <div className="flex items-center gap-2 p-2.5 text-emerald-400 text-xs bg-emerald-950/40 border border-emerald-500/30 rounded">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Added to interest list!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-[#1c1811] border border-amber-500/30 rounded px-3 py-2 text-xs text-[#f5eedb] focus:outline-none focus:border-amber-400 placeholder-[#7d7463]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded"
              >
                {loading ? "Joining..." : "Join The Interest List"}
              </button>
            </form>
          )}
        </div>

        {/* Mobile Book Graphic Preview */}
        <div className="relative w-full rounded overflow-hidden border border-amber-500/20 shadow-xl mb-6">
          <Image
            src="/images/american-injustice-desktop.jpg"
            alt="American Injustice - Don Matthews"
            width={1200}
            height={675}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Mobile 4 Pillars */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2.5 rounded bg-[#14100b] border border-[#2b2419]">
            <Shield className="w-4 h-4 text-amber-400 mb-1" />
            <h4 className="text-[11px] font-bold uppercase text-amber-300 font-serif">A True Story</h4>
            <p className="text-[10px] text-[#b8ad96]">A Marine&apos;s promise.</p>
          </div>
          <div className="p-2.5 rounded bg-[#14100b] border border-[#2b2419]">
            <Scale className="w-4 h-4 text-amber-400 mb-1" />
            <h4 className="text-[11px] font-bold uppercase text-amber-300 font-serif">Warfare</h4>
            <p className="text-[10px] text-[#b8ad96]">Restoring truth.</p>
          </div>
          <div className="p-2.5 rounded bg-[#14100b] border border-[#2b2419]">
            <Star className="w-4 h-4 text-amber-400 mb-1" />
            <h4 className="text-[11px] font-bold uppercase text-amber-300 font-serif">3 Cases</h4>
            <p className="text-[10px] text-[#b8ad96]">MS, UT, TX documented.</p>
          </div>
          <div className="p-2.5 rounded bg-[#14100b] border border-[#2b2419]">
            <Feather className="w-4 h-4 text-amber-400 mb-1" />
            <h4 className="text-[11px] font-bold uppercase text-amber-300 font-serif">A Call to Stand</h4>
            <p className="text-[10px] text-[#b8ad96]">Freedom isn&apos;t free.</p>
          </div>
        </div>
      </div>

    </section>
  );
}