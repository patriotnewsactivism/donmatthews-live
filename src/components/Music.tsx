"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Music, Play, ExternalLink, ChevronDown } from "lucide-react";

// Verified against the actual BandLab album listing (screenshot confirmed
// by Don, 2026-07-12) -- "Bad Actors: Volume 1", released Jan 09, 2025,
// 17 tracks total. This is the source of truth. Do not reorder or add/
// remove tracks without re-checking against the real BandLab listing.
const trackList = [
  { title: "Silence Ain't Consent", duration: "3:32", story:
      "This opening track sets the tone for everything that follows. When communities stay silent in the face of corruption, that silence is often mistaken for consent. But make no mistake — silence is not agreement. It's often fear, exhaustion, or learned helplessness. This is North Mississippi's warning: we're not staying silent anymore." },
  { title: "Unbroken", duration: "5:03", story:
      "The heartbeat of the album — the moment the storytelling stops whispering and starts roaring. Every verse is pulled from the wreckage of real events: corrupt cops filing false reports, officials crossing state lines to retaliate, a system that chose power over truth. \"Unbroken\" is the declaration that no matter how many times they tried to disappear your voice, you walked out stronger." },
  { title: "In the Shadows Tonight (The Reckoning)", duration: "4:18", story:
      "One of the most confrontational and revealing tracks on the album. Rather than focusing solely on systemic actors, this song turns its gaze toward a more intimate origin of destruction — false accusations and manipulative actions that set in motion many of the legal battles and human-rights violations that followed." },
  { title: "Double Dipped", duration: "4:16", story:
      "One of the album's most pointed indictments of personal betrayal colliding with state-enabled corruption — repeated attempts to \"double dip\" on child support by claiming payments were never received when they'd already been issued, while a state agency let the fraud stand instead of correcting it." },
  { title: "Morgan County Blues", duration: "4:03", story:
      "Steps outside the artist's own battles to spotlight another victim of manufactured criminality: a Utah real estate photographer arrested while lawfully doing his job. The track exposes how fragile freedom becomes when officers choose narrative over truth." },
  { title: "The Osteen Files – Exhibit L", duration: "3:49", story: null },
  { title: "A Warrant For A Lie", duration: "3:33", story: null },
  { title: "The Crowder Files", duration: "3:32", story:
      "The documentary centerpiece compiling the receipts — the false statements, the manipulated legal filings, the weaponized agencies, and the trail of destruction left behind." },
  { title: "Eleven Months Too Long", duration: "3:47", story:
      "Documents one of the most egregious examples of pretrial detention abuse in the saga — nearly a year of imprisonment endured without conviction, freedom stolen, constitutional rights trampled." },
  { title: "Caught Red Handed", duration: "3:59", story:
      "The receipts track — the moment when all the documentation, all the evidence, all the contradictions come together to prove what was always true: they lied, and they got caught." },
  { title: "Osteen Lied", duration: "3:35", story: null },
  { title: "Land of the Free, Unless Its Me", duration: "4:11", story: null },
  { title: "She Called The State", duration: "3:54", story:
      "Documents the moment personal conflict became state-sponsored persecution — how a single phone call can activate an entire apparatus of government power against an individual." },
  { title: "Osteen's Fall", duration: "3:26", story: null },
  { title: "The Gaslight Anthem", duration: "2:28", story:
      "\"You're crazy. That didn't happen. You're misremembering. Nobody will believe you.\" The anthem of the gaslighter — reclaiming reality and documenting the tactics used to make victims question their own truth." },
  { title: "Governors Gone Too Far", duration: "3:21", story:
      "When corruption reaches the highest levels of state government, when the governor's office itself becomes complicit in covering up injustice, someone has to say it out loud." },
  { title: "Scandalous", duration: "3:13", story:
      "Closes the album with the most personal betrayal of all — the scandalous acts committed by the woman he married and had three children with. This track documents the calculated destruction that came from within his own home." }
];

export default function MusicSection() {
  const [openTrack, setOpenTrack] = useState<string | null>(null);

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
              <p className="text-xs text-gray-500 mb-4">
                Every track is an affidavit. Click a track with a story icon to read what's behind it.
              </p>
              <div className="flex flex-col gap-3">
                {trackList.map((track, index) => {
                  const isOpen = openTrack === track.title;
                  const hasStory = Boolean(track.story);
                  return (
                    <div
                      key={track.title}
                      className="rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => hasStory && setOpenTrack(isOpen ? null : track.title)}
                        className={`w-full flex items-center gap-4 p-3 text-left ${hasStory ? "" : "cursor-default"}`}
                      >
                        <span className="text-xs font-mono text-gold font-bold w-6 shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm font-medium text-gray-300 flex-1">{track.title}</span>
                        <span className="text-xs font-mono text-gray-600 shrink-0">{track.duration}</span>
                        {hasStory && (
                          <ChevronDown
                            className={`w-4 h-4 text-gold/70 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        )}
                      </button>
                      {isOpen && hasStory && (
                        <div className="px-3 pb-4 pl-13">
                          <p className="text-xs text-gray-400 leading-relaxed pl-6">{track.story}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
