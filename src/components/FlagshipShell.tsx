import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Technology", "/technology"],
  ["American Injustice", "/american-injustice"],
  ["The Record", "/record"],
  ["Music", "/music"],
  ["Press", "/press"],
  ["Updates", "/updates"],
  ["Support", "/support"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/92 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-5">
        <div className="flex items-center justify-between gap-4 py-3 sm:gap-6 sm:py-4">
          <Link href="/" className="shrink-0 text-[13px] font-black tracking-[0.14em] text-[#c9a84c] sm:text-base sm:tracking-[0.18em]">DON MATTHEWS</Link>
          <nav className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[13px] text-white/60 lg:flex">
            {nav.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
          </nav>
          <Link href="/contact" className="rounded-md border border-[#c9a84c]/40 px-3 py-1.5 text-[11px] font-bold text-[#c9a84c] sm:py-2 sm:text-xs lg:hidden">Contact</Link>
        </div>
        <nav className="-mx-1 flex gap-4 overflow-x-auto whitespace-nowrap border-t border-white/5 px-1 py-2.5 text-[11px] text-white/55 [scrollbar-width:none] sm:gap-5 sm:py-3 sm:text-xs lg:hidden">
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
          <Link href="/updates" className="hover:text-white">Updates</Link>
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
      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-24">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#c9a84c] sm:text-xs sm:tracking-[0.22em]">{eyebrow}</p>
        <h1 className="mt-3 max-w-5xl text-[2.25rem] font-black leading-[.98] tracking-[-0.025em] sm:mt-4 sm:text-6xl sm:tracking-normal lg:text-7xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-white/60 sm:mt-6 sm:text-xl sm:leading-8">{intro}</p>
        {actions ? <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">{actions}</div> : null}
      </div>
    </section>
  );
}

export function FlagshipPage({ children }: { children: ReactNode }) {
  return <main className="min-h-screen bg-[#0a0a0a] text-white"><SiteHeader />{children}<SiteFooter /></main>;
}

export function GoldButton({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  const classes = "rounded-md bg-[#c9a84c] px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-[#d9bb64] sm:text-base";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>
  ) : (
    <Link href={href} className={classes}>{children}</Link>
  );
}

export function OutlineButton({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  const classes = "rounded-md border border-[#c9a84c]/45 px-5 py-3 text-center text-sm font-bold text-[#c9a84c] transition hover:bg-[#c9a84c]/10 sm:text-base";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>
  ) : (
    <Link href={href} className={classes}>{children}</Link>
  );
}
