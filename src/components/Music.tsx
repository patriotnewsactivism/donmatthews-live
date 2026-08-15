"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Music, ExternalLink, ChevronDown, Play, Pause, Download, Loader2, CheckCircle } from "lucide-react";

// Verified against the actual BandLab album listing (screenshot confirmed
// by Don, 2026-07-12) -- "Bad Actors: Volume 1", released Jan 09, 2025,
// 17 tracks total. This is the source of truth. Do not reorder or add/
// remove tracks without re-checking against the real BandLab listing.
const trackList = [
  { title: "Silence Ain't Consent", duration: "3:32", src: "/audio/01-silence-aint-consent.m4a", story:
      "This opening track sets the tone for everything that follows. When communities stay silent in the face of corruption, that silence is often mistaken for consent. But make no mistake — silence is not agreement. It's often fear, exhaustion, or learned helplessness. This is North Mississippi's warning: we're not staying silent anymore." },
  { title: "Unbroken", duration: "5:03", src: "/audio/02-unbroken.m4a", story:
      "The heartbeat of the album — the moment the storytelling stops whispering and starts roaring. Every verse is pulled from the wreckage of real events: corrupt cops filing false reports, officials crossing state lines to retaliate, a system that chose power over truth. \"Unbroken\" is the declaration that no matter how many times they tried to disappear your voice, you walked out stronger." },
  { title: "In the Shadows Tonight (The Reckoning)", duration: "4:18", src: "/audio/03-in-the-shadows-tonight.m4a", story:
      "One of the most confrontational and revealing tracks on the album. Rather than focusing solely on systemic actors, this song turns its gaze toward a more intimate origin of destruction — false accusations and manipulative actions that set in motion many of the legal battles and human-rights violations that followed." },
  { title: "Double Dipped", duration: "4:16", src: "/audio/04-double-dipped.m4a", story:
      "One of the album's most pointed indictments of personal betrayal colliding with state-enabled corruption — repeated attempts to \"double dip\" on child support by claiming payments were never received when they'd already been issued, while a state agency let the fraud stand instead of correcting it." },
  { title: "Morgan County Blues", duration: "4:03", src: "/audio/05-morgan-county-blues.m4a", story:
      "Steps outside the artist's own battles to spotlight another victim of manufactured criminality: a Utah real estate photographer arrested while lawfully doing his job. The track exposes how fragile freedom becomes when officers choose narrative over truth." },
  { title: "The Osteen Files – Exhibit L", duration: "3:49", src: "/audio/06-the-osteen-files-exhibit-l.m4a", story:
      "Exhibit L. Just one letter. One piece of evidence in a mountain of documentation that reveals a pattern of misconduct so extensive, it required its own filing system. This track chronicles the beginning of the Osteen investigation — where the first documents surfaced, where the lies began to unravel, and where the truth started demanding attention. When you need to alphabetize your corruption, you know the reckoning is coming." },
  { title: "A Warrant For A Lie", duration: "3:33", src: "/audio/07-a-warrant-for-a-lie.m4a", story:
      "They swore an oath. They signed their names. They stood before a judge and declared it was the truth. But it wasn't. This is the story of a warrant built on fabrications — a legal document that should represent justice, instead weaponized to destroy an innocent life." },
  { title: "The Crowder Files", duration: "3:32", src: "/audio/08-the-crowder-files.m4a", story:
      "The documentary centerpiece compiling the receipts — the false statements, the manipulated legal filings, the weaponized agencies, and the trail of destruction left behind." },
  { title: "Eleven Months Too Long", duration: "3:47", src: "/audio/09-eleven-months-too-long.m4a", story:
      "Documents one of the most egregious examples of pretrial detention abuse in the saga — nearly a year of imprisonment endured without conviction, freedom stolen, constitutional rights trampled." },
  { title: "Caught Red Handed", duration: "3:59", src: "/audio/10-caught-red-handed.m4a", story:
      "The receipts track — the moment when all the documentation, all the evidence, all the contradictions come together to prove what was always true: they lied, and they got caught." },
  { title: "Osteen Lied", duration: "3:35", src: "/audio/11-osteen-lied.m4a", story:
      "Three words. Undeniable truth. Documented proof. Osteen lied. Not once. Not by accident. Not a misunderstanding. A calculated, deliberate, provable lie that destroyed lives and perverted justice." },
  { title: "Land of the Free, Unless Its Me", duration: "4:11", src: "/audio/12-land-of-the-free-unless-its-me.m4a", story:
      "Confronts the bitter irony at the heart of American justice: the freedoms we celebrate don't apply equally to everyone. This track examines how constitutional protections evaporate when you become a target, how rights become privileges revoked at the discretion of those in power." },
  { title: "She Called The State", duration: "3:54", src: "/audio/13-she-called-the-state.m4a", story:
      "Documents the moment personal conflict became state-sponsored persecution — how a single phone call can activate an entire apparatus of government power against an individual." },
  { title: "Osteen's Fall", duration: "3:26", src: "/audio/14-osteens-fall.m4a", story:
      "Every corrupt empire eventually crumbles. Every bad actor eventually faces their reckoning. This track chronicles the downfall — when the evidence became overwhelming, when the lies could no longer be sustained, when justice finally began to turn its gaze toward the guilty." },
  { title: "The Gaslight Anthem", duration: "2:28", src: "/audio/15-the-gaslight-anthem.m4a", story:
      "\"You're crazy. That didn't happen. You're misremembering. Nobody will believe you.\" The anthem of the gaslighter — reclaiming reality and documenting the tactics used to make victims question their own truth." },
  { title: "Governors Gone Too Far", duration: "3:21", src: "/audio/16-governors-gone-too-far.m4a", story:
      "When corruption reaches the highest levels of state government, when the governor's office itself becomes complicit in covering up injustice, someone has to say it out loud." },
  { title: "Scandalous", duration: "3:13", src: "/audio/17-scandalous.m4a", story:
      "Closes the album with the most personal betrayal of all — the scandalous acts committed by the woman he married and had three children with. This track documents the calculated destruction that came from within his own home." }
];

export default function MusicSection() {
  const [openTrack, setOpenTrack] = useState<string | null>(null);
  const [playingTitle, setPlayingTitle] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [downloadEmail, setDownloadEmail] = useState("");
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadEmail) return;
    setDownloadState("loading");
    try {
      const res = await fetch("https://badactors.online/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: downloadEmail, source: "donmatthews.live" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDownloadUrl(data.downloadUrl);
      setDownloadState("success");
    } catch {
      setDownloadState("error");
    }
  };

  const handlePlayToggle = (track: (typeof trackList)[number]) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingTitle === track.title) {
      audio.pause();
      setPlayingTitle(null);
      return;
    }

    audio.src = track.src;
    audio.play().catch(() => {
      // Autoplay/interaction restrictions — user gesture already present here so should succeed.
    });
    setPlayingTitle(track.title);
  };

  return (
    <section id="music" className="py-24 relative overflow-hidden bg-[#0c0c0c]">
      {/* Background glow */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Single shared audio element driving whichever track is active */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingTitle(null)}
        onPause={() => setPlayingTitle((prev) => (audioRef.current?.paused ? prev : null))}
      />

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
            <div className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl border-2 border-gold/30 shadow-2xl overflow-hidden bg-[#151515]">
              <img
                src="/images/bad-actors-cover.jpg"
                alt="Bad Actors: Volume 1 album cover"
                className="w-full h-auto block"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Artist</p>
                  <p className="text-sm font-semibold text-white">Don Matthews</p>
                </div>
                <p className="text-xs text-gold/80 font-mono">17 TRACKS</p>
              </div>
            </div>

            {/* Free Download Block */}
            <div className="max-w-md mx-auto lg:mx-0 w-full rounded-lg border border-gold/20 bg-white/[0.02] p-4">
              <h4 className="text-xs font-bold text-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Download className="w-3.5 h-3.5" />
                Free Album Download
              </h4>
              {downloadState === "success" && downloadUrl ? (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                  <span>
                    Check your email — or{" "}
                    <a href={downloadUrl} className="text-gold underline">
                      grab it directly here
                    </a>
                    .
                  </span>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 min-w-0 bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50"
                  />
                  <button
                    type="submit"
                    disabled={downloadState === "loading"}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gold/10 border border-gold/30 text-gold text-sm font-semibold rounded-md hover:bg-gold/20 transition-colors disabled:opacity-60"
                  >
                    {downloadState === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Get It
                  </button>
                </form>
              )}
              {downloadState === "error" && (
                <p className="text-xs text-red-400 mt-2">Something went wrong — please try again.</p>
              )}
              <p className="text-[10px] text-gray-600 mt-2">All 17 tracks, in order. No spam, just the album.</p>
            </div>

            {/* Links Block */}
            <div className="flex flex-col gap-4 max-w-md mx-auto lg:mx-0 w-full">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                Also Available On
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
                Hit play to listen right here. Click a track with a story icon to read what's behind it.
              </p>
              <div className="flex flex-col gap-3">
                {trackList.map((track, index) => {
                  const isOpen = openTrack === track.title;
                  const hasStory = Boolean(track.story);
                  const isPlaying = playingTitle === track.title;
                  return (
                    <div
                      key={track.title}
                      className="rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors overflow-hidden"
                    >
                      <div className="w-full flex items-center gap-4 p-3 text-left">
                        <button
                          type="button"
                          onClick={() => handlePlayToggle(track)}
                          aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                        <span className="text-xs font-mono text-gold font-bold w-6 shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() => hasStory && setOpenTrack(isOpen ? null : track.title)}
                          className={`flex items-center gap-4 flex-1 text-left ${hasStory ? "" : "cursor-default"}`}
                        >
                          <span className={`text-sm font-medium flex-1 ${isPlaying ? "text-gold" : "text-gray-300"}`}>{track.title}</span>
                        </button>
                        <span className="text-xs font-mono text-gray-600 shrink-0">{track.duration}</span>
                        {hasStory && (
                          <button type="button" onClick={() => setOpenTrack(isOpen ? null : track.title)}>
                            <ChevronDown
                              className={`w-4 h-4 text-gold/70 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </div>
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
