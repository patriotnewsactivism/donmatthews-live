"use client";

import { useRef, useState } from "react";

/**
 * Don Matthews live avatar hero — first thing visitors see on donmatthews.live.
 *
 * Still frame first: nothing live starts until the visitor clicks to talk.
 * On click, a WebRTC session opens to Don's LiveTalking avatar on the WTP News
 * GPU box (via the /don/* rewrites in next.config.js) and Don answers in his
 * own Cartesia voice. The avatar is don_matthews_v2, built from the trimmed
 * reference Matthew approved (straight, wider framing, no zoomed opening).
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

export default function DonAvatarHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sessionRef = useRef<string | null>(null);
  const [state, setState] = useState<HeroState>("idle");
  const [speaking, setSpeaking] = useState(false);

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
          setState("offline");
          sessionRef.current = null;
        }
      };
      // Receive only: we want Don's video and audio, not to publish ours.
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
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
      if (answer.sessionid) sessionRef.current = answer.sessionid;
    } catch (err) {
      console.warn("[don-avatar] activation failed:", err);
      setState("offline");
    }
  }

  function endSession() {
    try {
      pcRef.current?.close();
    } catch {
      /* already closed */
    }
    pcRef.current = null;
    sessionRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
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
                <img
                  src="/images/don-avatar-poster.jpg"
                  alt="Don Matthews — tap to talk live"
                  className="absolute inset-0 aspect-square h-full w-full object-cover"
                />
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
                Live with Don Matthews, in his own voice. Type and he answers.
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
