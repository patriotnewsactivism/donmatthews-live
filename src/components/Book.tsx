"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle, Loader2 } from "lucide-react";

export default function Book() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you! You've been subscribed successfully.");
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
    <section id="book" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left / Title info */}
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-gold font-semibold text-sm uppercase tracking-widest">
              <BookOpen className="w-4 h-4" />
              <span>Upcoming Book Release</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              American Injustice
            </h2>
            <p className="text-sm font-mono text-gold-light uppercase tracking-wider">
              By Matthew Reardon (Don Matthews)
            </p>
            <p className="text-gray-400 font-light leading-relaxed">
              A firsthand account of constitutional violations, judicial misconduct, and the relentless fight for civil rights in modern America. Explore the depths of the legal machinery, systemic errors, and personal perseverance.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
              <span>Publishing on Amazon</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Coming Soon</span>
            </div>
          </div>

          {/* Right / Newsletter sign up */}
          <div className="md:col-span-5">
            <div className="p-8 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent shadow-xl relative">
              <h3 className="text-lg font-bold text-white mb-2">Get Notified</h3>
              <p className="text-xs text-gray-400 mb-6 font-light">
                Sign up to receive immediate updates, release schedules, and sneak peeks directly to your inbox.
              </p>

              {status === "success" ? (
                <div className="flex flex-col items-center text-center p-4 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="book-email" className="sr-only">Email Address</label>
                    <input
                      id="book-email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-rose-400 font-medium">{message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gold hover:bg-gold-light disabled:bg-gold/50 text-black font-semibold rounded-lg text-sm transition-colors duration-300"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Notify Me"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
