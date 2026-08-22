import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["American Injustice", "/american-injustice"],
  ["The Record", "/record"],
  ["Music", "/music"],
  ["Press", "/press"],
  ["Support", "/support"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/92 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link href="/" className="shrink-0 font-black tracking-[0.18em] text-[#c9a84c]">DON MATTHEWS</Link>
          <nav className="hidden flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm text-white/60 lg:flex">
            {nav.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
          </nav>
          <Link href="/contact" className="rounded-md border border-[#c9a84c]/40 px-3 py-2 text-xs font-bold text-[#c9a84c] lg:hidden">Contact</Link>
        </div>
        <nav className="-mx-1 flex gap-5 overflow-x-auto whitespace-nowrap border-t border-white/5 px-1 py-3 text-xs text-white/55 [scrollbar-width:none] lg:hidden">
          {nav.slice(0, -1).map(([label, href]) => <Link key={href} href={href} className="shrink-0 transition hover:text-white">{label}</Link>)}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080808]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-black tracking-[0.16em] text-[#c9a84c]">DON MATTHEWS</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">Journalism, technology, American Injustice, documentary music, and the public record.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/45">
          <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
      <div className="border-t border-white/5 px-5 py-5 text-center text-xs text-white/30">© 2026 Don Matthews. All rights reserved.</div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, intro, actions }: { eyebrow: string; title: string; intro: string; actions?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.14),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24">
        <p className="text-xs font-black tracking-[0.22em] text-[#c9a84c]">{eyebrow}</p>
        <h1 className="mt-4 max-w-5xl text-5xl font-black leading-[1] sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60 sm:text-xl">{intro}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function FlagshipPage({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#0a0a0a] text-white"><SiteHeader />{children}<SiteFooter /></main>;
}

export function GoldButton({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="rounded-md bg-[#c9a84c] px-5 py-3 font-bold text-black transition hover:bg-[#d9bb64]">{children}</a>
  ) : (
    <Link href={href} className="rounded-md bg-[#c9a84c] px-5 py-3 font-bold text-black transition hover:bg-[#d9bb64]">{children}</Link>
  );
}

export function OutlineButton({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="rounded-md border border-[#c9a84c]/45 px-5 py-3 font-bold text-[#c9a84c] transition hover:bg-[#c9a84c]/10">{children}</a>
  ) : (
    <Link href={href} className="rounded-md border border-[#c9a84c]/45 px-5 py-3 font-bold text-[#c9a84c] transition hover:bg-[#c9a84c]/10">{children}</Link>
  );
}
