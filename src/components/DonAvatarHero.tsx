"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Don Matthews live avatar hero — first thing visitors see on donmatthews.live.
 *
 * Still frame first: nothing live starts until the visitor clicks to talk.
 * On click, the hero asks POST /api/don/session for an Anam session token
 * and a seconds budget, then opens the Anam face (createClient +
 * streamToVideoElement) and the conversation WebSocket to the hosted Anam
 * stage server (mic -> Cartesia Ink STT -> Gemini -> Cartesia Sonic TTS ->
 * Anam audio passthrough). Cartesia audio is NEVER played directly; the
 * Anam <video> element is the single audio source, so there is no doubled
 * speech.
 *
 * PAYWALL (Matthew, Nov. 27, 2026): every visitor gets exactly 1 free
 * minute talking with Don, ONCE per IP address, ever — enforced server-side
 * at /api/don/session (SHA-256 IP hash, Supabase). After that, $1/minute
 * via Stripe Checkout minute packs. The hero counts down the budget and
 * stops at 0; the stage server enforces the budget live and is
 * authoritative. 100% of the money funds the investigations and the projects.
 *
 * The old WebRTC / LiveTalking activation (avatar.wtpnews.org) is gone:
 * that backend died with the China 5090.
 */

type HeroState = "idle" | "connecting" | "live" | "paywall" | "offline";
type MicMode = "open" | "ptt";

// Minimal shape of the Anam JS SDK client (dynamic import, no SSR).
interface AnamAudioInput {
  sendAudioChunk: (data: ArrayBuffer | Uint8Array) => void;
  endSequence: () => void;
}
interface AnamClient {
  streamToVideoElement: (id: string) => Promise<void>;
  createAgentAudioInputStream: (opts: {
    encoding: string;
    sampleRate: number;
    channels: number;
  }) => AnamAudioInput;
  interruptPersona: () => void | Promise<void>;
  stopStreaming: () => Promise<void>;
}

interface SessionResponse {
  sessionToken: string | null;
  sessionId?: string;
  secondsRemaining: number;
  freeSecondsRemaining: number;
  paidSecondsRemaining: number;
  stageConfigured: boolean;
  stageWsUrl: string | null;
  error?: string;
}

// RMS (float32, 0..1) above which the mic counts as the visitor speaking.
const MIC_SPEECH_RMS = 0.03;
// Don't send barge-in more often than this while Don is speaking.
const BARGE_DEBOUNCE_MS = 1000;

const SESSION_STORAGE_KEY = "don-paywall-session";

const PACKS = [
  { key: "5", minutes: 5, price: "$5" },
  { key: "10", minutes: 10, price: "$10" },
  { key: "20", minutes: 20, price: "$20" },
] as const;

function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function getOrCreateBrowserToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `don-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return null;
  }
}

export default function DonAvatarHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const anamRef = useRef<AnamClient | null>(null);
  const audioInputRef = useRef<AnamAudioInput | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micNodeRef = useRef<AudioWorkletNode | null>(null);
  const deadlineRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialFreeRef = useRef(0);
  const initialPaidRef = useRef(0);
  const startTotalRef = useRef(0);
  const endingRef = useRef(false);
  const donSpeakingRef = useRef(false);
  const lastBargeRef = useRef(0);
  const lastLevelAtRef = useRef(0);
  const micModeRef = useRef<MicMode>("open");
  const pttHeldRef = useRef(false);

  const [state, setState] = useState<HeroState>("idle");
  const [browserToken, setBrowserToken] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [freeLeft, setFreeLeft] = useState(0);
  const [caption, setCaption] = useState("");
  const [donSpeaking, setDonSpeaking] = useState(false);
  const [micMode, setMicMode] = useState<MicMode>("open");
  const [micLive, setMicLive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [pttHeld, setPttHeld] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [offlineNote, setOfflineNote] = useState<string | null>(null);
  const [paidNote, setPaidNote] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkingMinutes, setCheckingMinutes] = useState(false);

  useEffect(() => {
    setBrowserToken(getOrCreateBrowserToken());
    // Returning from Stripe Checkout (?don_paid=1): check the balance and
    // tell the visitor their minutes are ready.
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("don_paid") === "1"
    ) {
      const token = getOrCreateBrowserToken();
      window.history.replaceState({}, "", window.location.pathname);
      if (token) {
        void fetch("/api/don/balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ browserToken: token }),
        })
          .then((r) => r.json())
          .then((d: { paidSecondsRemaining?: number }) => {
            if ((d.paidSecondsRemaining || 0) > 0) {
              setPaidNote(
                `Payment received — you have ${fmtClock(d.paidSecondsRemaining || 0)} with Don. Tap to talk.`,
              );
            } else {
              setPaidNote(
                "Payment is still processing — tap “Check my minutes” below if it takes a moment.",
              );
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  function setMode(mode: MicMode) {
    micModeRef.current = mode;
    setMicMode(mode);
  }

  function setPtt(next: boolean) {
    pttHeldRef.current = next;
    setPttHeld(next);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimer(totalSeconds: number, freeSeconds: number) {
    stopTimer();
    startTotalRef.current = totalSeconds;
    initialFreeRef.current = freeSeconds;
    initialPaidRef.current = totalSeconds - freeSeconds;
    deadlineRef.current = Date.now() + totalSeconds * 1000;
    setSecondsLeft(totalSeconds);
    setFreeLeft(freeSeconds);
    timerRef.current = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000),
      );
      setSecondsLeft(left);
      setFreeLeft(Math.min(left, initialFreeRef.current));
      if (left <= 0) void timeUp();
    }, 250);
  }

  function reportUsage() {
    const token = browserToken;
    if (!token) return;
    const used = Math.max(
      0,
      startTotalRef.current - Math.max(0, secondsLeft),
    );
    const freeUsed = Math.min(used, initialFreeRef.current);
    const paidUsed = used - freeUsed;
    if (freeUsed <= 0 && paidUsed <= 0) return;
    try {
      void fetch("/api/don/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          browserToken: token,
          freeSecondsUsed: freeUsed,
          paidSecondsUsed: paidUsed,
          source: "hero",
        }),
        keepalive: true,
      });
    } catch {
      /* usage reporting is best-effort; the stage server reports authoritatively */
    }
  }

  function stopVoice() {
    try {
      wsRef.current?.close();
    } catch {
      /* already closed */
    }
    wsRef.current = null;
    try {
      micNodeRef.current?.disconnect();
    } catch {
      /* already disconnected */
    }
    micNodeRef.current = null;
    try {
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {
      /* already stopped */
    }
    micStreamRef.current = null;
    try {
      void audioCtxRef.current?.close();
    } catch {
      /* already closed */
    }
    audioCtxRef.current = null;
    pttHeldRef.current = false;
    donSpeakingRef.current = false;
    setPttHeld(false);
    setMicLive(false);
    setDonSpeaking(false);
    setMicLevel(0);
  }

  function stopAnam() {
    const client = anamRef.current;
    anamRef.current = null;
    audioInputRef.current = null;
    if (client) {
      try {
        void client.stopStreaming().catch(() => {});
      } catch {
        /* already stopped */
      }
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function cleanupSession() {
    stopTimer();
    stopVoice();
    stopAnam();
    setCaption("");
    setMicError(null);
  }

  async function timeUp() {
    if (endingRef.current) return;
    endingRef.current = true;
    reportUsage();
    cleanupSession();
    setState("paywall");
    endingRef.current = false;
  }

  function endSession() {
    reportUsage();
    cleanupSession();
    setState("idle");
  }

  function sendInterrupt() {
    if (!donSpeakingRef.current) return;
    const now = Date.now();
    if (now - lastBargeRef.current < BARGE_DEBOUNCE_MS) return;
    lastBargeRef.current = now;
    try {
      void anamRef.current?.interruptPersona();
    } catch {
      /* ignore */
    }
    try {
      audioInputRef.current?.endSequence();
    } catch {
      /* ignore */
    }
    donSpeakingRef.current = false;
    setDonSpeaking(false);
    try {
      wsRef.current?.send(JSON.stringify({ type: "interrupt" }));
    } catch {
      /* socket gone */
    }
  }

  async function startMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      micStreamRef.current = stream;
      let ctx: AudioContext;
      try {
        ctx = new AudioContext({ sampleRate: 16000 });
      } catch {
        ctx = new AudioContext();
      }
      audioCtxRef.current = ctx;
      await ctx.audioWorklet.addModule("/mic-worklet.js");
      const source = ctx.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(ctx, "pcm16-capture");
      micNodeRef.current = node;
      node.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
        // Mic level meter + barge-in, from the PCM chunk.
        try {
          const pcm = new Int16Array(e.data);
          let sumSq = 0;
          let n = 0;
          for (let i = 0; i < pcm.length; i += 10) {
            const s = pcm[i] / 32768;
            sumSq += s * s;
            n++;
          }
          const rms = n > 0 ? Math.sqrt(sumSq / n) : 0;
          const now = Date.now();
          if (now - lastLevelAtRef.current > 150) {
            lastLevelAtRef.current = now;
            setMicLevel(Math.min(1, rms * 4));
          }
          if (rms >= MIC_SPEECH_RMS) sendInterrupt();
        } catch {
          /* meter only */
        }
        const streaming =
          micModeRef.current === "open" || pttHeldRef.current;
        if (!streaming) return;
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(e.data);
          } catch {
            /* drop the chunk; the socket reports its own close */
          }
        }
      };
      source.connect(node);
      setMicError(null);
      setMicLive(true);
    } catch (err) {
      console.warn("[don-avatar] mic unavailable:", err);
      setMicError("Mic blocked — type instead, or allow the mic and retry.");
      setMicLive(false);
    }
  }

  async function activate() {
    if (state === "connecting" || state === "live") return;
    if (!browserToken) return;
    setState("connecting");
    setOfflineNote(null);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/don/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ browserToken }),
      });
      const data = (await res.json().catch(() => ({}))) as SessionResponse;
      if (!res.ok) {
        throw new Error(data.error || `session HTTP ${res.status}`);
      }
      if (!data.stageConfigured || !data.stageWsUrl) {
        setOfflineNote(
          "Don's live avatar is being set up — check back soon.",
        );
        setState("offline");
        return;
      }
      if (!data.sessionToken || data.secondsRemaining <= 0) {
        setState("paywall");
        return;
      }

      // Anam face (dynamic import: browser-only SDK, never SSR).
      const sdk = await import("@anam-ai/js-sdk");
      const anam = sdk.createClient(data.sessionToken, {
        disableInputAudio: true,
      }) as unknown as AnamClient;
      anamRef.current = anam;
      await anam.streamToVideoElement("don-avatar-video");
      // ONLY after streamToVideoElement resolves.
      const audioInput = anam.createAgentAudioInputStream({
        encoding: "pcm_s16le",
        sampleRate: 16000,
        channels: 1,
      });
      audioInputRef.current = audioInput;

      // Conversation socket to the stage server.
      const ws = new WebSocket(
        `${data.stageWsUrl}/ws?session=${encodeURIComponent(browserToken)}&budget=${data.secondsRemaining}`,
      );
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;
      ws.onopen = () => {
        void startMic().then(() => {
          setState("live");
          startTimer(data.secondsRemaining, data.freeSecondsRemaining);
        });
      };
      ws.onmessage = (ev: MessageEvent) => {
        if (typeof ev.data !== "string") {
          // TTS PCM chunk -> Anam lip-sync. Never played directly.
          try {
            audioInputRef.current?.sendAudioChunk(ev.data as ArrayBuffer);
          } catch {
            /* drop the chunk */
          }
          return;
        }
        let msg: {
          type?: string;
          text?: string;
          final?: boolean;
          message?: string;
        };
        try {
          msg = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (msg.type === "transcript" && msg.final && msg.text) {
          setCaption("You: " + msg.text);
        } else if (msg.type === "reply-start") {
          donSpeakingRef.current = true;
          setDonSpeaking(true);
        } else if (msg.type === "reply-end") {
          donSpeakingRef.current = false;
          setDonSpeaking(false);
          try {
            audioInputRef.current?.endSequence();
          } catch {
            /* ignore */
          }
        } else if (msg.type === "time-up") {
          void timeUp();
        } else if (msg.type === "error") {
          console.warn("[don-avatar] stage error:", msg.message);
        }
      };
      ws.onclose = () => {
        // Socket dropped: mic off, caption cleared. The countdown still
        // bounds the session, and the stage reports usage on its close.
        setMicLive(false);
        setCaption("");
      };
      ws.onerror = () => {
        /* onclose follows; the timer still bounds the session */
      };
    } catch (err) {
      console.warn("[don-avatar] activation failed:", err);
      setOfflineNote("Don's live avatar is unavailable right now — tap to retry.");
      setState("offline");
    }
  }

  async function speak() {
    const text = (inputRef.current?.value || "").trim();
    if (!text || state !== "live") return;
    try {
      wsRef.current?.send(JSON.stringify({ type: "say", text }));
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      /* leave the text in place */
    }
  }

  async function buyPack(packKey: (typeof PACKS)[number]["key"]) {
    if (!browserToken) return;
    setCheckoutError(null);
    try {
      const res = await fetch("/api/don/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ browserToken, pack: packKey }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        checkoutUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.checkoutUrl) {
        setCheckoutError(
          data.error === "payments_not_configured"
            ? "Payments aren't set up yet — check back soon."
            : "Could not start checkout; try again.",
        );
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setCheckoutError("Could not start checkout; try again.");
    }
  }

  async function checkMinutes() {
    if (!browserToken) return;
    setCheckingMinutes(true);
    try {
      const res = await fetch("/api/don/balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ browserToken }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        secondsRemaining?: number;
      };
      if ((data.secondsRemaining || 0) > 0) {
        setPaidNote(
          `You have ${fmtClock(data.secondsRemaining || 0)} with Don.`,
        );
        await activate();
      } else {
        setCheckoutError("No minutes yet — if you just paid, give it a moment and check again.");
      }
    } catch {
      setCheckoutError("Could not check your minutes; try again.");
    } finally {
      setCheckingMinutes(false);
    }
  }

  const statusLabel =
    state === "live"
      ? "● Live"
      : state === "connecting"
        ? "Connecting…"
        : state === "paywall"
          ? "Free minute used up"
          : state === "offline"
            ? "Feed unavailable — tap to retry"
            : "Tap to talk live";

  const timeLabel =
    state === "live"
      ? freeLeft > 0
        ? `Free minute — ${fmtClock(secondsLeft)} left`
        : `Paid time — ${fmtClock(secondsLeft)} left`
      : null;

  return (
    <section className="border-b border-[#c9a84c]/15 bg-[radial-gradient(circle_at_80%_0%,rgba(201,168,76,0.10),transparent_32rem),#0a0908]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[460px]">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#c9a84c]/30 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            {/* One video element, always mounted, so the live stream survives
                the idle -> live switch. The still frame overlays it until
                the visitor clicks to activate. */}
            <video
              id="don-avatar-video"
              ref={videoRef}
              autoPlay
              playsInline
              className="aspect-square h-auto w-full object-cover"
              aria-label="Don Matthews live — talking avatar in his own voice"
            />
            {(state === "idle" || state === "offline" || state === "paywall") && (
              <>
                <picture>
                  <source srcSet="/images/don-avatar-photo.webp" type="image/webp" />
                  <img
                    src="/images/don-avatar-photo.jpg"
                    alt="Don Matthews — tap to talk live"
                    width={720}
                    height={1086}
                    className="absolute inset-0 aspect-square h-full w-full object-cover object-top"
                  />
                </picture>
                {state !== "paywall" && (
                  <button
                    type="button"
                    onClick={() => void activate()}
                    className="absolute inset-0 grid place-items-center bg-black/25 transition hover:bg-black/10"
                    aria-label="Talk live with Don Matthews"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/60 bg-black/70 px-6 py-3 text-sm font-black text-[#e0c16b] backdrop-blur">
                      ▶ Talk live with Don
                    </span>
                  </button>
                )}
              </>
            )}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent px-4 pb-4 pt-10">
              <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-[#e0c16b]">
                {statusLabel}
              </p>
              {timeLabel && (
                <p className="mt-1 text-center text-xs font-black text-white/80">
                  {timeLabel}
                </p>
              )}
            </div>
          </div>

          {paidNote && state !== "live" && (
            <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm leading-6 text-emerald-200">
              {paidNote}
            </p>
          )}

          {state === "live" ? (
            <>
              {/* Live voice: open mic by default, push-to-talk on demand. */}
              <div className="mt-4 rounded-lg border border-white/15 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "inline-block h-2.5 w-2.5 rounded-full " +
                        (micLive ? "bg-emerald-400" : "bg-white/25")
                      }
                      aria-hidden="true"
                    />
                    <span className="text-sm font-black text-white/80">
                      {micLive
                        ? micMode === "open"
                          ? "Mic live — just talk"
                          : pttHeld
                            ? "Talking…"
                            : "Push to talk ready"
                        : "Mic off"}
                    </span>
                    {donSpeaking && (
                      <span className="text-xs font-black uppercase tracking-wider text-[#e0c16b]">
                        Don speaking
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setMode("open")}
                      aria-pressed={micMode === "open"}
                      className={
                        "rounded-md px-3 py-1.5 text-xs font-black transition " +
                        (micMode === "open"
                          ? "bg-[#c9a84c]/20 text-[#e0c16b]"
                          : "text-white/50 hover:text-white")
                      }
                    >
                      Open mic
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("ptt")}
                      aria-pressed={micMode === "ptt"}
                      className={
                        "rounded-md px-3 py-1.5 text-xs font-black transition " +
                        (micMode === "ptt"
                          ? "bg-[#c9a84c]/20 text-[#e0c16b]"
                          : "text-white/50 hover:text-white")
                      }
                    >
                      Push to talk
                    </button>
                  </div>
                </div>
                {/* Mic level meter */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-[width] duration-150"
                    style={{ width: Math.round(micLevel * 100) + "%" }}
                  />
                </div>
                {micMode === "ptt" && (
                  <button
                    type="button"
                    onPointerDown={() => setPtt(true)}
                    onPointerUp={() => setPtt(false)}
                    onPointerLeave={() => setPtt(false)}
                    onPointerCancel={() => setPtt(false)}
                    onContextMenu={(e) => e.preventDefault()}
                    className={
                      "mt-3 w-full touch-none select-none rounded-lg border px-5 py-3 text-sm font-black transition " +
                      (pttHeld
                        ? "border-[#c9a84c] bg-[#c9a84c]/30 text-[#e0c16b]"
                        : "border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#e0c16b] hover:bg-[#c9a84c]/15")
                    }
                  >
                    {pttHeld ? "● Talking — release to stop" : "Hold to talk"}
                  </button>
                )}
                {donSpeaking && (
                  <button
                    type="button"
                    onClick={sendInterrupt}
                    className="mt-3 w-full rounded-lg border border-white/15 px-5 py-2 text-sm font-black text-white/70 transition hover:text-white"
                  >
                    Interrupt Don
                  </button>
                )}
                {micError && (
                  <p className="mt-2 text-xs leading-5 text-amber-300/90">
                    {micError}
                  </p>
                )}
              </div>

              {caption && (
                <p className="mt-3 text-center text-sm leading-6 text-white/70">
                  {caption}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask Don something…"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void speak();
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#c9a84c]/60"
                />
                <button
                  type="button"
                  onClick={() => void speak()}
                  className="rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-5 py-3 text-sm font-black text-[#e0c16b] transition hover:bg-[#c9a84c]/15"
                >
                  Speak
                </button>
                <button
                  type="button"
                  onClick={endSession}
                  className="rounded-lg border border-white/15 px-4 py-3 text-sm font-black text-white/70 transition hover:text-white"
                >
                  End
                </button>
              </div>
              <p className="mt-3 text-center text-xs leading-6 text-white/40">
                Mic is open — just talk, and Don answers. Type also works,
                or switch to push to talk.
              </p>
            </>
          ) : state === "paywall" ? (
            <>
              <div className="mt-4 rounded-lg border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-5 py-5 text-center">
                <p className="text-base font-black text-[#e0c16b]">
                  Your free minute is up.
                </p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Keep talking with Don — $1 a minute. Every dollar goes to
                  the investigations and the projects.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {PACKS.map((pack) => (
                    <button
                      key={pack.key}
                      type="button"
                      onClick={() => void buyPack(pack.key)}
                      className="rounded-lg border border-[#c9a84c]/40 bg-black/40 px-2 py-3 transition hover:bg-[#c9a84c]/20"
                    >
                      <span className="block text-lg font-black text-[#e0c16b]">
                        {pack.price}
                      </span>
                      <span className="block text-xs font-black text-white/60">
                        {pack.minutes} minutes
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-white/40">
                  One-time payment — not a subscription.
                </p>
                <button
                  type="button"
                  onClick={() => void checkMinutes()}
                  disabled={checkingMinutes}
                  className="mt-3 text-xs font-black text-white/60 underline transition hover:text-white disabled:opacity-50"
                >
                  {checkingMinutes
                    ? "Checking…"
                    : "I already paid — check my minutes"}
                </button>
                {checkoutError && (
                  <p className="mt-2 text-xs leading-5 text-amber-300/90">
                    {checkoutError}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void activate()}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-5 py-3 text-sm font-black text-[#e0c16b] transition hover:-translate-y-0.5 hover:bg-[#c9a84c]/15"
              >
                {state === "connecting"
                  ? "Connecting…"
                  : "▶ Talk live with Don"}
              </button>
              <p className="mt-3 text-center text-xs leading-6 text-white/40">
                Still frame until you click — nothing starts until you do.
                Your first minute with Don is free. Don answers live, in his
                own voice.
              </p>
              {offlineNote && (
                <p className="mt-2 text-center text-xs leading-5 text-amber-300/90">
                  {offlineNote}
                </p>
              )}
            </>
          )}
        </div>

        <div className="lg:pl-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d5b45b] sm:text-xs">
            Don Matthews · Live
          </p>
          <h1 className="display-serif mt-4 text-5xl font-semibold leading-[.95] tracking-[-0.035em] sm:text-7xl">
            Don Matthews.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Investigative journalist, builder, and author of{" "}
            <em>American Injustice</em> — speaking for himself, in his own
            voice. The record, the reporting, and the work, from the source.
          </p>
          <p className="mt-6 max-w-2xl border-l-2 border-[#c9a84c]/50 pl-4 text-sm leading-7 text-white/50 italic">
            “That’s why this had to be track one. Back in May of 2017, right
            after Deputy Pruitt put me in handcuffs on the square…”
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/american-injustice"
              className="inline-flex rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-5 py-3 text-sm font-black text-[#e0c16b] transition hover:-translate-y-0.5 hover:bg-[#c9a84c]/15"
            >
              American Injustice →
            </a>
            <a
              href="https://wtpnews.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg border border-white/15 px-5 py-3 text-sm font-black text-white/70 transition hover:-translate-y-0.5 hover:text-white"
            >
              We The People News →
            </a>
          </div>
          <p className="mt-8 max-w-2xl text-[11px] leading-6 text-white/35">
            Disclosure: the Don on screen is an AI-generated presenter of Don
            Matthews himself. Facial animation and voice are synthesized from
            his own likeness and his own Cartesia voice. Editorial decisions
            and reporting are made by We The People News.
          </p>
        </div>
      </div>
    </section>
  );
}
