"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Download, Loader2, CheckCircle, Flame } from "lucide-react";

// Standalone single promo — separate from the Volume 1 album in Music.tsx.
// Free download capped at `cap` claims via the singles-download API, which
// enforces the cap atomically server-side (Supabase RPC advisory lock), so
// this component only needs to reflect state, not enforce the cap itself.

const TRACK_SLUG = "happy-fuck-the-cops-day";
const TITLE = "Happy Fuck The Cops Day";
const AUDIO_SRC = "/audio/happy-fuck-the-cops-day.mp3";
const CAP = 100;

export default function SingleReleasePromo() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    fetch(`/api/single-download-count?track=${TRACK_SLUG}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.remaining === "number") setRemaining(d.remaining);
      })
      .catch(() => {});
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
  };

  const soldOut = remaining !== null && remaining <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || soldOut) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/single-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, track: TRACK_SLUG }),
      });
      const data = await res.json();
      if (data.soldOut) {
        setRemaining(0);
        setStatus("error");
        return;
      }
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setDownloadUrl(data.downloadUrl);
      setAlreadyClaimed(!!data.alreadyClaimed);
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#0c0c0c] border-y border-gold/10">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-gold" />
          <span className="text-gold font-semibold text-xs uppercase tracking-widest">
            Happy Fuck The Cops Day
          </span>
          <Flame className="w-4 h-4 text-gold" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white text-center tracking-tight mb-2">
          {TITLE}
        </h2>
        <p className="text-center text-gray-400 font-light mb-10">
          Free digital download — first {CAP} only
        </p>

        <audio
          ref={audioRef}
          src={AUDIO_SRC}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="rounded-2xl border-2 border-gold/30 bg-[#151515] p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
              className="shrink-0 w-14 h-14 rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 transition-colors flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            <div>
              <p className={`font-medium ${isPlaying ? "text-gold" : "text-white"}`}>{TITLE}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Tap to preview</p>
            </div>
          </div>

          <div className="text-center mb-6">
            {remaining === null ? (
              <p className="text-gray-600 text-xs uppercase tracking-widest">Checking availability&hellip;</p>
            ) : soldOut ? (
              <p className="text-red-400 font-semibold text-sm uppercase tracking-widest">
                All {CAP} free downloads claimed
              </p>
            ) : (
              <p className="text-gold font-semibold text-sm uppercase tracking-widest">
                {remaining} of {CAP} free downloads left
              </p>
            )}
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <CheckCircle className="w-10 h-10 text-gold" />
              <p className="text-white font-medium text-center">
                {alreadyClaimed ? "Here's your download again" : "You're in — check your email"}
              </p>
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  className="flex items-center gap-2 px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Now
                </a>
              )}
            </div>
          ) : soldOut ? (
            <div className="text-center">
              <a
                href="https://suno.com/@badactors"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 border border-gold/40 text-gold rounded-lg hover:bg-gold/10 transition-colors font-semibold"
              >
                Stream It Instead
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gold text-black text-sm font-semibold rounded-md hover:bg-gold/90 transition-colors disabled:opacity-60"
              >
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Get Free Download
              </button>
              {status === "error" && !soldOut && (
                <p className="text-xs text-red-400 text-center">Something went wrong — please try again.</p>
              )}
              <p className="text-[10px] text-gray-600 text-center">No spam, ever.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
