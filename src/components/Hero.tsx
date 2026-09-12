"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, BookText, Tablet, CheckCircle2 } from "lucide-react";

type SubscribeStatus = "idle" | "loading" | "success" | "error";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submitted = status === "success";
  const loading = status === "loading";

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/book-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "hero_header_interest" }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Unable to join the interest list right now.");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to join the interest list right now.");
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

        {/* ------------------------------------------------------------- */}
        {/* 2. THE THREE PRE-ORDER BUTTONS                                */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute top-[58.5%] left-[3.9%] w-[40.4%] h-[9.2%] z-30 grid grid-cols-3 gap-[2.4%]">
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

        {/* ------------------------------------------------------------- */}
        {/* 3. EMAIL SIGNUP / INTEREST LIST FORM                          */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute top-[74.0%] left-[10.4%] w-[33.2%] h-[5.8%] z-30">
          {submitted ? (
            <div className="w-full h-full flex items-center justify-center gap-1.5 bg-[#120f0a]/95 border border-emerald-500/70 rounded text-emerald-400 text-[8px] sm:text-[11px] lg:text-xs font-serif px-2">
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Added to the interest list!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="w-full h-full flex items-center gap-[1.5%]">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-[59%] h-full bg-black/40 hover:bg-black/60 focus:bg-black/80 text-[#f5eedb] text-[8px] sm:text-[11px] lg:text-xs px-2 sm:px-3 rounded border border-transparent focus:border-amber-400 focus:outline-none transition-colors placeholder-[#8e8473]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded"
              >
                <span className="sr-only">Join The Interest List</span>
              </button>
              {status === "error" ? (
                <p role="status" className="text-[11px] leading-4 text-red-300">
                  {errorMessage}
                </p>
              ) : null}
            </form>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 4. BOTTOM 4 FEATURE CARDS                                     */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute top-[86.5%] left-[2.8%] w-[54.0%] h-[11.2%] z-30 grid grid-cols-4 gap-[1.5%]">
          <Link
            href="/about"
            title="A True Story - A Marine's Promise"
            className="w-full h-full rounded border border-transparent hover:border-amber-400/50 hover:bg-amber-400/5 transition-colors cursor-pointer"
          />
          <Link
            href="/american-injustice"
            title="Constitutional Warfare - Restoring Truth"
            className="w-full h-full rounded border border-transparent hover:border-amber-400/50 hover:bg-amber-400/5 transition-colors cursor-pointer"
          />
          <Link
            href="/record"
            title="Three Federal Cases - Documented, Filed, Uncovered"
            className="w-full h-full rounded border border-transparent hover:border-amber-400/50 hover:bg-amber-400/5 transition-colors cursor-pointer"
          />
          <a
            href="https://help.donmatthews.live"
            target="_blank"
            rel="noopener noreferrer"
            title="A Call to Stand - Support & Action"
            className="w-full h-full rounded border border-transparent hover:border-amber-400/50 hover:bg-amber-400/5 transition-colors cursor-pointer"
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. 3D BOOK COVER HOTSPOT (Right Side)                         */}
        {/* ------------------------------------------------------------- */}
        <Link
          href="/american-injustice"
          title="American Injustice - Book Overview"
          className="absolute top-[10.5%] left-[57.5%] w-[31.5%] h-[78.0%] z-20 rounded border border-transparent hover:border-amber-400/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all cursor-pointer"
        />

      </div>
    </section>
  );
}
