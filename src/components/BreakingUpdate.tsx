"use client";

import React from "react";
import { AlertTriangle, PlayCircle, FileWarning, ArrowUpRight } from "lucide-react";

// Slim case-update strip — deliberately compact (single row, no big
// paragraph cards). Full detail lives on wtpnews.org; this is a pointer,
// not the article. Keep this in sync with the American Injustice
// manuscript and wtpnews.org reporting. Update `updated` + the two items
// below when there's a real docket/procedural development; don't leave
// stale dates sitting here.
const updated = "August 11, 2026";

const items = [
  {
    icon: PlayCircle,
    tone: "gold" as const,
    label: "Sentencing hearing recording now public",
    href: "https://wtpnews.org",
  },
  {
    icon: FileWarning,
    tone: "red" as const,
    label: "Reardon v. Osteen (Galveston) dismissed — judgment withheld",
    href: "https://wtpnews.org",
  },
];

export default function BreakingUpdate() {
  return (
    <div className="relative bg-[#120a0a] border-b border-red-900/30">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 text-red-400 text-[11px] font-bold uppercase tracking-widest shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Case Updates</span>
          <span className="text-gray-600 font-normal normal-case hidden md:inline">
            &middot; {updated}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-2 flex-1 min-w-0">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-2 text-sm font-medium truncate ${
                item.tone === "gold"
                  ? "text-gray-200 hover:text-gold"
                  : "text-gray-200 hover:text-red-300"
              }`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 ${
                  item.tone === "gold" ? "text-gold" : "text-red-400"
                }`}
              />
              <span className="truncate">{item.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
