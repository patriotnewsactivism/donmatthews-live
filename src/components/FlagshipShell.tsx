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
    <header className="sticky top-0 z-50 border-b border-[#c9a84c]/15 bg-[#090909]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-5">
        <div className="flex items-center justify-between gap-4 py-3.5 sm:py-4">
          <Link href="/" className="group shrink-0">
            <span className="block text-[13px] font-black tracking-[0.16em] text-[#c9a84c] transition group-hover:text-[#e1c66f] sm:text-base sm:tracking-[0.19em]">DON MATTHEWS</span>
            <span className="mt-0.5 block text-[8px] font-bold tracking-[0.22em] text-white/30 sm:hidden">OFFICIAL FLAGSHIP</span>
          </Link>

          <nav className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 text-[13px] text-white/55 lg:flex">
            {nav.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
          </nav>

          <details className="relative lg:hidden [&>summary::-webkit-details-marker]:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-[#c9a84c]/35 bg-[#c9a84c]/[0.06] px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#c9a84c] transition hover:bg-[#c9a84c]/10">Menu</summary>
            <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#c9a84c]/20 bg-[#0d0d0d]/98 p-2 shadow-2xl shadow-black/70 backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-1">
                {nav.map(([label, href], index) => (
                  <Link key={href} href={href} className="rounded-xl px-3 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/[0.05] hover:text-white">
                    <span className="mr-2 text-[10px] font-black text-[#c9a84c]/65">{String(index + 1).padStart(2, "0")}</span>{label}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </div>
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
    <section className="relative isolate overflow-hidden border-b border-[#c9a84c]/15 bg-[#090909]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_82%_18%,rgba(201,168,76,0.18),transparent_33%),radial-gradient(circle_at_8%_95%,rgba(201,168,76,0.06),transparent_28%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute right-[-7rem] top-[-7rem] h-60 w-60 rounded-full border border-[#c9a84c]/10 sm:h-80 sm:w-80" />
      <div className="absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full border border-[#c9a84c]/10 sm:h-56 sm:w-56" />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-24">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-[#c9a84c] sm:w-12" />
          <p className="text-[10px] font-black tracking-[0.2em] text-[#c9a84c] sm:text-xs sm:tracking-[0.24em]">{eyebrow}</p>
        </div>
        <h1 className="max-w-5xl text-[2.2rem] font-black leading-[.98] tracking-[-0.035em] sm:text-6xl sm:tracking-normal lg:text-7xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-white/58 sm:mt-6 sm:text-xl sm:leading-8">{intro}</p>
        {actions ? <div className="mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">{actions}</div> : null}
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
  const classes = "rounded-md border border-[#c9a84c]/45 bg-black/10 px-5 py-3 text-center text-sm font-bold text-[#c9a84c] transition hover:bg-[#c9a84c]/10 sm:text-base";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}</a>
  ) : (
    <Link href={href} className={classes}>{children}</Link>
  );
}
