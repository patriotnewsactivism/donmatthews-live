"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "Talents", href: "#talents" },
  { label: "Music", href: "#music" },
  { label: "Book", href: "#book" },
  { label: "Bundle", href: "#bundle" },
  { label: "Press", href: "#press" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active link detection based on section visibility
      const scrollPosition = window.scrollY + 200;
      for (const link of links) {
        const el = document.querySelector(link.href);
        if (el) {
          const top = (el as HTMLElement).offsetTop;
          const height = (el as HTMLElement).offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActive(link.href);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(href);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-[#0a0a0af0] backdrop-blur-md py-4 border-white/5"
            : "bg-transparent py-6 border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => handleClick(e, "#hero")}
            className="text-lg font-bold text-white tracking-widest hover:text-gold transition-colors"
          >
            MATTHEW REARDON <span className="text-gold font-light text-xs ml-1 font-mono uppercase">Don Matthews</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider transition-colors hover:text-gold",
                  active === link.href ? "text-gold" : "text-gray-400"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-lg z-40 md:hidden flex flex-col justify-center items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={cn(
                "text-lg font-bold uppercase tracking-widest transition-colors hover:text-gold",
                active === link.href ? "text-gold" : "text-gray-400"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
