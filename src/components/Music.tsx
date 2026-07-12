"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music, Play, ExternalLink } from "lucide-react";

const trackList = [
  "Unbroken",
  "Scandalous",
  "Governors Gone Too Far",
  "The Gaslight Anthem",
  "Silence Ain't Consent",
  "In the Shadows Tonight (The Reckoning)",
  "Double Dipped (Crowder Exposed)",
  "Morgan County Blues",
  "Eleven Months Too Long",
  "Caught Red Handed",
  "The Crowder Files",
  "She Called The State"
];

const teasers = [
  "Daddy Never Said Goodbye",
  "Boxes & Bars",
  "Flocked Up"
];

export default function MusicSection() {
  return (
    <section id="music" className="py-24 relative overflow-hidden bg-[#0c0c0c]">
      {/* Background glow */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center md:text-left mb-16">
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3 justify-center md:justify-start">
            <Music className="w-4 h-4" />
            <span>Official Soundtrack</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Bad Actors Project
          </h2>
          <p className="max-w-3xl text-gray-400 font-light text-lg">
            An unapologetic, evidence-rich documentary music project exposing government, judicial, and law enforcement corruption.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Album cover / links */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="aspect-square w-full max-w-md mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-gold/20 via-[#151515] to-black border-2 border-gold/30 flex flex-col justify-between p-8 relative shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a
                  href="https://www.bandlab.com/badactors/albums/8ea7105d-acc1-f011-8195-6045bd30a4b0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gold rounded-full text-black hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 fill-black" />
                </a>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded">
                  ALBUM VOLUME 1 (2025)
                </span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  badactors.online
                </span>
              </div>
              <div className="my-auto py-8">
                <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2">
                  BAD ACTORS
                </h3>
                <p className="text-gold font-semibold text-lg sm:text-xl tracking-wider">
                  VOLUME 1
                </p>
              </div>
              <div className="flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Artist</p>
                  <p className="text-sm font-semibold text-white">Don Matthews</p>
                </div>
                <p className="text-xs text-gold/80 font-mono">17 TRACKS</p>
              </div>
            </div>

            {/* Links Block */}
            <div className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0 w-full">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                Listen & Stream
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://www.bandlab.com/badactors/albums/8ea7105d-acc1-f011-8195-6045bd30a4b0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-sm text-white hover:border-gold/30 transition-all"
                >
                  <span>BandLab</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </a>
                <a
                  href="https://suno.com/@badactors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-sm text-white hover:border-gold/30 transition-all"
                >
                  <span>Suno AI</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                </a>
                <div className="flex items-center justify-between px-4 py-3 border border-white/5 bg-white/[0.01] rounded-lg text-sm text-gray-500 cursor-not-allowed">
                  <span>Spotify</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-white/5 px-1.5 py-0.5 rounded text-gray-400">Soon</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border border-white/5 bg-white/[0.01] rounded-lg text-sm text-gray-500 cursor-not-allowed">
                  <span>Apple Music</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-white/5 px-1.5 py-0.5 rounded text-gray-400">Soon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tracks list */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                Volume 1 Official Track List
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trackList.map((track, index) => (
                  <div
                    key={track}
                    className="flex items-center gap-4 p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-xs font-mono text-gold font-bold w-5">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium text-gray-300">{track}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Teaser Section */}
            <div className="p-6 rounded-xl border border-gold/10 bg-gold/[0.02] mt-4">
              <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-3">
                Volume 2 Coming 2026 — Teasers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {teasers.map((teaser) => (
                  <div
                    key={teaser}
                    className="p-3 rounded border border-dashed border-white/10 bg-transparent text-center"
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Upcoming</p>
                    <p className="text-sm font-semibold text-white">{teaser}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
