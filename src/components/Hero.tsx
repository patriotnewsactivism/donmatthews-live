"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

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
        body: JSON.stringify({ email, source: "banner_hero_interest" }),
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
    <section className="relative w-full overflow-hidden bg-[#0a0a0a] m-0 p-0">
      {/* 
        Full-bleed 16:9 banner: stretches from far left to far right on all screens.
        Percentage hotspots scale proportionally across mobile and desktop.
      */}
      <div className="relative w-full aspect-[16/9]">
        
        {/* Full Edge-to-Edge Image */}
        <Image
          src="/images/american-injustice-desktop.jpg"
          alt="American Injustice: A Memoir of Constitutional Warfare - Don Matthews"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top w-full h-full"
        />

        {/* ------------------------------------------------------------- */}
        {/* 1. TOP NAV HOTSPOTS                                           */}
        {/* ------------------------------------------------------------- */}
        {/* Logo / Site Title (Home link) */}
        <Link
          href="/"
          title="DONMATTHEWS.LIVE Home"
          className="absolute top-[2.2%] left-[2.2%] w-[42%] h-[4.8%] z-30 cursor-pointer"
        />

        {/* Right Navigation Links */}
        <div className="absolute top-[2.2%] right-[2.2%] h-[4.8%] flex items-center gap-[1%] z-30">
          <Link
            href="/about"
            title="About Don"
            className="h-full px-2 flex items-center justify-center rounded hover:bg-black/40 text-transparent hover:text-amber-200 text-[8px] sm:text-[11px] lg:text-xs uppercase font-serif transition-colors"
          >
            About Don
          </Link>
          <Link
            href="/american-injustice"
            title="The Book"
            className="h-full px-2 flex items-center justify-center rounded hover:bg-black/40 text-transparent hover:text-amber-200 text-[8px] sm:text-[11px] lg:text-xs uppercase font-serif transition-colors"
          >
            The Book
          </Link>
          <Link
            href="/press"
            title="Media"
            className="h-full px-2 flex items-center justify-center rounded hover:bg-black/40 text-transparent hover:text-amber-200 text-[8px] sm:text-[11px] lg:text-xs uppercase font-serif transition-colors"
          >
            Media
          </Link>
          <Link
            href="/updates"
            title="Updates"
            className="h-full px-2 flex items-center justify-center rounded hover:bg-black/40 text-transparent hover:text-amber-200 text-[8px] sm:text-[11px] lg:text-xs uppercase font-serif transition-colors"
          >
            Updates
          </Link>
          <Link
            href="/contact"
            title="Contact"
            className="h-full px-2 flex items-center justify-center rounded hover:bg-black/40 text-transparent hover:text-amber-200 text-[8px] sm:text-[11px] lg:text-xs uppercase font-serif transition-colors"
          >
            Contact
          </Link>
          {/* Pre-Order Now Top Button */}
          <a
            href="#preorder"
            title="Pre-Order Now"
            className="w-[68px] sm:w-[105px] lg:w-[130px] h-[78%] rounded border border-transparent hover:border-amber-400 hover:bg-amber-400/20 transition-all cursor-pointer"
          />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. THE THREE PRE-ORDER BUTTONS                                */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute top-[58.5%] left-[3.9%] w-[40.4%] h-[9.2%] z-30 grid grid-cols-3 gap-[2.4%]">
          <a
            href="#preorder-paperback"
            id="preorder"
            title="Pre-Order Paperback"
            className="w-full h-full rounded border border-transparent hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
          />
          <a
            href="#preorder-hardcover"
            title="Pre-Order Hardcover"
            className="w-full h-full rounded border border-transparent hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
          />
          <a
            href="#preorder-ebook"
            title="Pre-Order eBook"
            className="w-full h-full rounded border border-transparent hover:border-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_12px_rgba(251,191,36,0.35)] transition-all cursor-pointer"
          />
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
                className="w-[39.5%] h-full bg-transparent hover:bg-amber-400/20 active:bg-amber-400/30 rounded border border-transparent hover:border-amber-400 transition-all cursor-pointer"
                title="Join The Interest List"
              >
                <span className="sr-only">Join The Interest List</span>
              </button>
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