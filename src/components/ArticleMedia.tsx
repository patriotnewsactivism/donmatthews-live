"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

type ArticleMediaProps = {
  alt: string;
  compact?: boolean;
  eyebrow?: string;
  src: string | null;
};

export function ArticleMedia({ alt, compact = false, eyebrow = "THE RECORD", src }: ArticleMediaProps) {
  const [failed, setFailed] = useState(!src);

  return (
    <div className={`article-media relative overflow-hidden bg-[#0b0b0b] ${compact ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(201,168,76,0.2),transparent_34%),linear-gradient(145deg,#15130e,#080808_62%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className={`absolute inset-0 flex flex-col justify-between p-5 transition duration-300 ${failed ? "opacity-100" : "opacity-0"}`} aria-hidden={!failed}>
        <div className="flex items-center justify-between gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#c9a84c]">
          <span>{eyebrow}</span>
          <span className="text-white/25">DM / FILE</span>
        </div>
        <div>
          <div className="mb-4 h-px w-16 bg-[#c9a84c]" />
          <p className="max-w-[22rem] text-lg font-black leading-tight text-white/88 sm:text-xl">{alt}</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">Source-first editorial record</p>
        </div>
      </div>

      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
        />
      ) : null}

      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 transition ${failed ? "opacity-0" : "opacity-100"}`} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e0c36b]/55 to-transparent" />
    </div>
  );
}
