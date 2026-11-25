"use client";

import { useRef, useState } from "react";
import { gatherAvatarOffer } from "@/lib/avatar-webrtc.mjs";

/**
 * Don Matthews live avatar hero — first thing visitors see on donmatthews.live.
 *
 * Still frame first: nothing live starts until the visitor clicks to talk.
 * On click, a WebRTC session opens to Don's LiveTalking avatar on the WTP News
 * GPU box (via the /don/* rewrites in next.config.js) and Don answers in his
 * own Cartesia voice. The avatar is don_matthews_v2, built from the trimmed
 * reference Matthew approved (straight, wider framing, no zoomed opening).
 *
 * Voice (mic) path: the same click also opens the visitor's mic and a
 * WebSocket to /don/ws/listen (hello {sessionid} -> binary PCM16 16kHz).
 * The Don orchestrator does energy VAD + faster-whisper STT server-side and
 * answers through the avatar, so it is a live two-way conversation. Default
 * mode is open mic (talk any time); Push to talk gates the mic to while the
 * button is held. If the mic is denied or the socket drops, the text box
 * still works. Barge-in: when Don is speaking and the visitor starts
 * talking, the client sends {"type":"barge"} so Don stops and listens.
 *
 * TURN credentials come from Vercel env vars (NEXT_PUBLIC_TURN_USERNAME /
 * NEXT_PUBLIC_TURN_CREDENTIAL). No credential is committed here: without them
 * the session still tries over STUN alone. The Don TURN user is `don-avatar`
 * on hermes.wtpnews.org:3478 — a dedicated credential, separate from the
 * Marcus page's leaked one.
 */
const TURN_USERNAME = process.env.NEXT_PUBLIC_TURN_USERNAME || "";
const TURN_CREDENTIAL = process.env.NEXT_PUBLIC_TURN_CREDENTIAL || "";

type HeroState = "idle" | "connecting" | "live" | "offline";
type MicMode = "open" | "ptt";

// RMS (float32, 0..1) above which the mic counts as the visitor speaking.
const MIC_SPEECH_RMS = 0.03;
// Don't send barge-in more often than this while Don is speaking.
const BARGE_DEBOUNCE_MS = 1000;

export default function DonAvatarHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sessionRef = useRef<string | null>(null);
  const [state, setState] = useState<HeroState>("idle");
  const [speaking, setSpeaking] = useState(false);

  // --- live voice (mic + /don/ws/listen) ---
  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const [micMode, setMicMode] = useState<MicMode>("open");
  const micModeRef = useRef<MicMode>("open");
  const [micLive, setMicLive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [pttHeld, setPttHeld] = useState(false);
  const pttHeldRef = useRef(false);
  const [micLevel, setMicLevel] = useState(0);
  const [caption, setCaption] = useState("");
  const [donSpeaking, setDonSpeaking] = useState(false);
  const donSpeakingRef = useRef(false);
  const lastBargeRef = useRef(0);
  const lastLevelAtRef = useRef(0);

  function setMode(mode: MicMode) {
    micModeRef.current = mode;
    setMicMode(mode);
  }

  function sendBargeIfNeeded(rms: number) {
    if (!donSpeakingRef.current) return;
    if (rms < MIC_SPEECH_RMS) return;
    const now = Date.now();
    if (now - lastBargeRef.current < BARGE_DEBOUNCE_MS) return;
    lastBargeRef.current = now;
    try {
      wsRef.current?.send(JSON.stringify({ type: "barge" }));
    } catch {
      /* socket gone; server VAD still ends the turn on silence */
    }
  }

  function streamMicChunk(input: Float32Array, sampleRate: number) {
    // Resample to 16 kHz mono PCM16, the format the orchestrator expects.
    const ratio = sampleRate / 16000;
    const outLen = Math.max(1, Math.floor(input.length / ratio));
    const pcm = new Int16Array(outLen);
    let sumSq = 0;
    for (let i = 0; i < outLen; i++) {
      const pos = i * ratio;
      const idx = Math.floor(pos);
      const frac = pos - idx;
      const a = input[idx] || 0;
      const b = input[Math.min(idx + 1, input.length - 1)] || 0;
      const s = a + (b - a) * frac;
      sumSq += s * s;
      const clamped = Math.max(-1, Math.min(1, s));
      pcm[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    }
    const rms = Math.sqrt(sumSq / outLen);
    // Mic level meter (throttled so we don't re-render every audio chunk).
    const now = Date.now();
    if (now - lastLevelAtRef.current > 150) {
      lastLevelAtRef.current = now;
      setMicLevel(Math.min(1, rms * 4));
    }
    sendBargeIfNeeded(rms);
    // Gate: open mic streams always; push-to-talk streams only while held.
    const streaming =
      micModeRef.current === "open" || pttHeldRef.current;
    if (!streaming) return;
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(pcm.buffer);
      } catch {
        /* drop the chunk; the socket reports its own close */
      }
    }
  }

  async function startVoice(sessionid: string) {
    // WebSocket to the Don orchestrator (same-origin /don/ws/listen rewrite).
    try {
      const proto =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const ws = new WebSocket(
        proto + window.location.host + "/don/ws/listen"
      );
      wsRef.current = ws;
      ws.onopen = () => {
        try {
          ws.send(JSON.stringify({ type: "hello", sessionid }));
        } catch {
          /* hello failed; the socket will close on its own */
        }
        setVoiceNote(null);
      };
      ws.onmessage = (ev) => {
        let data: {
          type?: string;
          text?: string;
          sentence?: string;
          state?: boolean;
          message?: string;
        };
        try {
          data = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (data.type === "transcript" && data.text) {
          setCaption("You: " + data.text);
        } else if (data.type === "speaking") {
          const speakingNow = data.state === true;
          donSpeakingRef.current = speakingNow;
          setDonSpeaking(speakingNow);
          if (data.sentence) setCaption("Don: " + data.sentence);
        } else if (data.type === "interrupted") {
          donSpeakingRef.current = false;
          setDonSpeaking(false);
        } else if (data.type === "error") {
          console.warn("[don-avatar] voice error:", data.message);
        }
      };
      ws.onclose = () => {
        setMicLive(false);
        setVoiceNote("Voice link dropped — type instead, or tap End and start again.");
      };
      ws.onerror = () => {
        /* onclose follows; the text box still works */
      };
    } catch (err) {
      console.warn("[don-avatar] voice socket failed:", err);
    }

    // Mic: opened on the same click that started the avatar (user gesture),
    // so the permission prompt is allowed. Default is open two-way.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
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
      const src = ctx.createMediaStreamSource(stream);
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = proc;
      // Mute the processor output: onaudioprocess must stay connected to
      // fire, but the mic must never play back through the speakers.
      const mute = ctx.createGain();
      mute.gain.value = 0;
      src.connect(proc);
      proc.connect(mute);
      mute.connect(ctx.destination);
      const rate = ctx.sampleRate;
      proc.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        streamMicChunk(input, rate);
      };
      setMicError(null);
      setMicLive(true);
    } catch (err) {
      console.warn("[don-avatar] mic unavailable:", err);
      setMicError("Mic blocked — type instead, or allow the mic and retry.");
      setMicLive(false);
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
      processorRef.current?.disconnect();
    } catch {
      /* already disconnected */
    }
    processorRef.current = null;
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
    setVoiceNote(null);
  }

  function setPtt(next: boolean) {
    pttHeldRef.current = next;
    setPttHeld(next);
  }

  async function activate() {
    if (state === "connecting" || state === "live") return;
    setState("connecting");
    try {
      const iceServers: RTCIceServer[] = [
        { urls: "stun:stun.l.google.com:19302" },
      ];
      if (TURN_USERNAME && TURN_CREDENTIAL) {
        iceServers.push({
          urls: "turn:hermes.wtpnews.org:3478",
          username: TURN_USERNAME,
          credential: TURN_CREDENTIAL,
        });
      }
      const pc = new RTCPeerConnection({ iceServers });
      pcRef.current = pc;
      pc.ontrack = (ev) => {
        const stream =
          ev.streams && ev.streams[0]
            ? ev.streams[0]
            : new MediaStream([ev.track]);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play().catch(() => {});
        }
      };
      pc.onconnectionstatechange = () => {
        const st = pc.connectionState;
        if (st === "connected") setState("live");
        else if (st === "failed" || st === "disconnected" || st === "closed") {
          stopVoice();
          setState("offline");
          sessionRef.current = null;
        }
      };
      // Receive only: we want Don's video and audio, not to publish ours.
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });

      await pc.setLocalDescription(await pc.createOffer());
      // /don/offer is non-trickle: send candidates in the initial SDP.
      // The original createOffer() result does not contain gathered ICE.
      const offer = await gatherAvatarOffer(pc);
      const res = await fetch("/don/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sdp: offer.sdp,
          type: offer.type,
          avatar: "don_matthews_v2",
        }),
      });
      if (!res.ok) throw new Error("signalling HTTP " + res.status);
      const answer = await res.json();
      if (!answer || !answer.sdp)
        throw new Error("no answer from avatar server");
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      if (answer.sessionid) {
        sessionRef.current = answer.sessionid;
        // Same click opens the mic + voice socket (open two-way by default).
        void startVoice(answer.sessionid);
      }
    } catch (err) {
      console.warn("[don-avatar] activation failed:", err);
      setState("offline");
    }
  }

  function endSession() {
    stopVoice();
    try {
      pcRef.current?.close();
    } catch {
      /* already closed */
    }
    pcRef.current = null;
    sessionRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCaption("");
    setMicError(null);
    setState("idle");
  }

  async function speak() {
    const text = (inputRef.current?.value || "").trim();
    if (!text || state !== "live" || !sessionRef.current) return;
    setSpeaking(true);
    try {
      const res = await fetch("/don/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionid: sessionRef.current, text }),
      });
      if (!res.ok) throw new Error("speak HTTP " + res.status);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.warn("[don-avatar] /don/speak failed, echo fallback:", err);
      try {
        await fetch("/don/human", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            type: "echo",
            interrupt: true,
            sessionid: sessionRef.current,
          }),
        });
        if (inputRef.current) inputRef.current.value = "";
      } catch {
        /* leave the text in place */
      }
    } finally {
      setSpeaking(false);
    }
  }

  const statusLabel =
    state === "live"
      ? "● Live"
      : state === "connecting"
        ? "Connecting…"
        : state === "offline"
          ? "Feed unavailable — tap to retry"
          : "Tap to talk live";

  return (
    <section className="border-b border-[#c9a84c]/15 bg-[radial-gradient(circle_at_80%_0%,rgba(201,168,76,0.10),transparent_32rem),#0a0908]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-center">
        <div className="mx-auto w-full max-w-[460px]">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#c9a84c]/30 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            {/* One video element, always mounted, so the live stream survives
                the idle -> live switch. The still frame overlays it until
                the visitor clicks to activate. */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="aspect-square h-auto w-full object-cover"
              aria-label="Don Matthews live — talking avatar in his own voice"
            />
            {(state === "idle" || state === "offline") && (
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
                <button
                  type="button"
                  onClick={activate}
                  className="absolute inset-0 grid place-items-center bg-black/25 transition hover:bg-black/10"
                  aria-label="Talk live with Don Matthews"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/60 bg-black/70 px-6 py-3 text-sm font-black text-[#e0c16b] backdrop-blur">
                    ▶ Talk live with Don
                  </span>
                </button>
              </>
            )}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent px-4 pb-4 pt-10">
              <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-[#e0c16b]">
                {statusLabel}
              </p>
            </div>
          </div>

          {state === "live" ? (
            <>
              {/* Live voice: open mic by default, push-to-talk on demand. */}
              <div className="mt-4 rounded-lg border border-white/15 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "inline-block h-2.5 w-2.5 rounded-full " +
                        (micLive
                          ? "bg-emerald-400"
                          : "bg-white/25")
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
                {micError && (
                  <p className="mt-2 text-xs leading-5 text-amber-300/90">
                    {micError}
                  </p>
                )}
                {voiceNote && !micError && (
                  <p className="mt-2 text-xs leading-5 text-amber-300/90">
                    {voiceNote}
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
                  disabled={speaking}
                  className="rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-5 py-3 text-sm font-black text-[#e0c16b] transition hover:bg-[#c9a84c]/15 disabled:opacity-50"
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
          ) : (
            <>
              <button
                type="button"
                onClick={activate}
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-5 py-3 text-sm font-black text-[#e0c16b] transition hover:-translate-y-0.5 hover:bg-[#c9a84c]/15"
              >
                {state === "connecting"
                  ? "Connecting…"
                  : "▶ Talk live with Don"}
              </button>
              <p className="mt-3 text-center text-xs leading-6 text-white/40">
                Still frame until you click — nothing starts until you do.
                Don answers live, in his own voice.
              </p>
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
