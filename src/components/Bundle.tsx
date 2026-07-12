"use client";

import React, { useState } from "react";
import { Check, Info, Loader2, Sparkles } from "lucide-react";

export default function Bundle() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Success! You've joined the bundle waitlist.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    }
  };

  return (
    <section id="bundle" className="py-24 bg-[#0c0c0c] relative overflow-hidden">
      {/* Decorative Grid Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4" />
            <span>The All-Access Pass</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            One Price. Everything.
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 font-light">
            Get unlimited access to all Don Matthews apps — BuildMyBot, CaseBuddy, TubeScribe, and every future release — for one flat monthly or annual fee.
          </p>
        </div>

        {/* Pricing Cards & Waitlist form combined */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Monthly */}
          <div className="lg:col-span-4 p-8 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between relative">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Monthly Tier</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-gray-400 text-sm">/ month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["BuildMyBot.App Access", "CaseBuddy.Live Premium", "TubeScribe Summations", "All Future App Launches"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button disabled className="w-full py-3 border border-white/10 bg-white/5 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed">
              Coming Soon
            </button>
          </div>

          {/* Annual */}
          <div className="lg:col-span-4 p-8 rounded-xl border-2 border-gold/40 bg-gold/[0.02] flex flex-col justify-between relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
              Save 32%
            </div>
            <div>
              <p className="text-xs font-bold text-gold uppercase tracking-widest mb-2 mt-2">Annual Pass</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">$399</span>
                <span className="text-gray-400 text-sm">/ year</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Full Year BuildMyBot", "Full Year CaseBuddy", "Full Year TubeScribe", "Priority Beta Access", "Dedicated Tech Support"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button disabled className="w-full py-3 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg text-sm font-semibold cursor-not-allowed transition-colors">
              Coming Soon
            </button>
          </div>

          {/* Join Waitlist Box */}
          <div className="lg:col-span-4 p-8 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-3">
                <Info className="w-4 h-4" />
                <span>Bundle Waitlist</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Early Access</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                Bundle pricing is coming soon. Enter your email below to reserve your spot on the priority waitlist and locked-in pricing.
              </p>
            </div>

            {status === "success" ? (
              <div className="p-4 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-center">
                <p className="text-sm font-semibold">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
                />
                {status === "error" && (
                  <p className="text-xs text-rose-400 font-medium">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-100 disabled:bg-white/50 text-black font-semibold rounded-lg text-sm transition-colors duration-300"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Join Waitlist"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
