"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type SignupStatus = "idle" | "loading" | "success" | "error";

export default function AmericanInjusticeBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/book-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, mode: "interest" }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof payload?.error === "string"
            ? payload.error
            : "Unable to join the interest list right now.",
        );
      }

      setStatus("success");
      setMessage("You’re on the American Injustice updates list.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to join the interest list right now.",
      );
    }
  }

  return (
    <section
      aria-labelledby="american-injustice-hero-title"
      className="relative w-full overflow-hidden border-b border-[#c9a84c]/20 bg-[#050504] text-[#f5eedb]"
    >
      <h1 id="american-injustice-hero-title" className="sr-only">
        American Injustice — A Memoir of Constitutional Warfare
      </h1>

      {/* The campaign artwork is the hero itself: full-bleed, uncropped, edge-to-edge. */}
      <div className="relative w-full bg-black">
        <Image
          src="/images/american-injustice-desktop.jpg"
          alt="American Injustice: A Memoir of Constitutional Warfare by Don Matthews"
          width={1536}
          height={864}
          priority
          sizes="100vw"
          className="block h-auto w-full select-none"
        />

        {/* Desktop interaction layer aligned to the baked campaign artwork. */}
        <div className="absolute inset-0 z-20 hidden lg:block" aria-label="American Injustice campaign actions">
          <Link
            href="/"
            aria-label="DonMatthews.live home"
            className="absolute left-[2.2%] top-[1.4%] h-[6%] w-[45%] rounded transition hover:bg-[#c9a84c]/[0.035]"
          />

          <Link href="/about" aria-label="About Don" className="absolute left-[57.3%] top-[1.6%] h-[5.3%] w-[7.4%] rounded transition hover:bg-[#c9a84c]/10" />
          <Link href="/american-injustice" aria-label="The Book" className="absolute left-[64.4%] top-[1.6%] h-[5.3%] w-[6.1%] rounded transition hover:bg-[#c9a84c]/10" />
          <Link href="/press" aria-label="Media" className="absolute left-[70.3%] top-[1.6%] h-[5.3%] w-[5.4%] rounded transition hover:bg-[#c9a84c]/10" />
          <Link href="/updates" aria-label="Updates" className="absolute left-[75.3%] top-[1.6%] h-[5.3%] w-[6.3%] rounded transition hover:bg-[#c9a84c]/10" />
          <Link href="/contact" aria-label="Contact" className="absolute left-[81.2%] top-[1.6%] h-[5.3%] w-[6.4%] rounded transition hover:bg-[#c9a84c]/10" />
          <Link
            href="/american-injustice#reserve-edition"
            aria-label="Pre-order American Injustice"
            className="absolute right-[2.3%] top-[1.3%] h-[5.5%] w-[10.3%] rounded border border-transparent transition hover:border-[#d7b658]/70 hover:bg-[#c9a84c]/10"
          />

          <Link href="/american-injustice#reserve-edition" aria-label="Reserve the paperback edition" className="absolute left-[2.8%] top-[58.4%] h-[8.3%] w-[13.6%] rounded transition hover:bg-[#c9a84c]/10" />
          <Link href="/american-injustice#reserve-edition" aria-label="Reserve the hardcover edition" className="absolute left-[17.1%] top-[58.4%] h-[8.3%] w-[13.5%] rounded transition hover:bg-[#c9a84c]/10" />
          <Link href="/american-injustice#reserve-edition" aria-label="Reserve the ebook edition" className="absolute left-[31.2%] top-[58.4%] h-[8.3%] w-[13.5%] rounded transition hover:bg-[#c9a84c]/10" />

          <Link
            href="/american-injustice"
            aria-label="Open the American Injustice book hub"
            className="absolute left-[57.5%] top-[9.5%] h-[81%] w-[31.5%] rounded-xl border border-transparent transition hover:border-[#c9a84c]/30 hover:shadow-[0_0_40px_rgba(201,168,76,0.12)]"
          />

          <div className="absolute left-[10.45%] top-[73.45%] h-[6.5%] w-[33.1%]">
            {status === "success" ? (
              <div className="flex h-full items-center justify-center rounded-md border border-emerald-500/50 bg-[#0d120d]/95 px-3 text-center text-[clamp(9px,.8vw,13px)] font-semibold text-emerald-300">
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex h-full items-center gap-[1.5%]">
                <label htmlFor="hero-email-desktop" className="sr-only">Email address</label>
                <input
                  id="hero-email-desktop"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email address"
                  className="h-full w-[59%] rounded-md border border-[#c9a84c]/20 bg-[#0b0d0d]/95 px-[3%] text-[clamp(9px,.8vw,13px)] text-[#f5eedb] outline-none transition placeholder:text-[#8f8574] focus:border-[#d7b658]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Join the American Injustice interest list"
                  className="h-full w-[39.5%] rounded-md border border-[#c9a84c]/30 bg-[#c9a84c]/95 text-[clamp(8px,.72vw,12px)] font-black uppercase tracking-[.04em] text-[#100c05] transition hover:bg-[#dfbc5b] disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "loading" ? "Joining…" : "Join the interest list"}
                </button>
              </form>
            )}
            {status === "error" ? (
              <p role="status" className="absolute left-0 top-[112%] rounded bg-black/90 px-2 py-1 text-[10px] text-red-300">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile utility layer: keeps the banner intact while making every action readable and tappable. */}
      <div className="border-t border-[#c9a84c]/15 bg-[linear-gradient(180deg,#0e0c09,#080706)] px-4 py-5 lg:hidden">
        <nav aria-label="Mobile flagship navigation" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-4 [scrollbar-width:none]">
          {[
            ["About", "/about"],
            ["The Book", "/american-injustice"],
            ["Media", "/press"],
            ["Updates", "/updates"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="shrink-0 rounded-full border border-[#c9a84c]/25 bg-white/[0.025] px-3 py-2 text-[10px] font-black uppercase tracking-[.12em] text-[#dfc478]">
              {label}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-3 gap-2">
          <Link href="/american-injustice#reserve-edition" className="rounded-lg border border-[#c9a84c]/35 bg-[#151109] px-2 py-3 text-center">
            <span className="block text-[9px] font-black uppercase tracking-[.12em] text-[#b89a4a]">Pre-order</span>
            <span className="mt-1 block text-xs font-black text-[#f0e3c8]">Paperback</span>
          </Link>
          <Link href="/american-injustice#reserve-edition" className="rounded-lg border border-[#c9a84c]/35 bg-[#151109] px-2 py-3 text-center">
            <span className="block text-[9px] font-black uppercase tracking-[.12em] text-[#b89a4a]">Pre-order</span>
            <span className="mt-1 block text-xs font-black text-[#f0e3c8]">Hardcover</span>
          </Link>
          <Link href="/american-injustice#reserve-edition" className="rounded-lg border border-[#c9a84c]/35 bg-[#151109] px-2 py-3 text-center">
            <span className="block text-[9px] font-black uppercase tracking-[.12em] text-[#b89a4a]">Pre-order</span>
            <span className="mt-1 block text-xs font-black text-[#f0e3c8]">eBook</span>
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-[#c9a84c]/25 bg-black/35 p-3.5">
          <p className="text-sm font-black text-[#d9b65c]">Get updates and early access</p>
          {status === "success" ? (
            <p className="mt-2 text-sm text-emerald-300">{message}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <label htmlFor="hero-email-mobile" className="sr-only">Email address</label>
              <input
                id="hero-email-mobile"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#10100f] px-3 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#c9a84c]/65"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-[#c9a84c] px-4 py-3 text-xs font-black uppercase tracking-[.08em] text-black disabled:cursor-wait disabled:opacity-65"
              >
                {status === "loading" ? "Joining…" : "Join the list"}
              </button>
            </form>
          )}
          {status === "error" ? <p role="status" className="mt-2 text-xs text-red-300">{message}</p> : null}
        </div>
      </div>
    </section>
  );
}
