"use client";

import { FormEvent, useState } from "react";

export default function FlagshipLeadForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("Saving your signup…");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const name = String(form.get("name") || "").trim();

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "donmatthews.live/new-flagship",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save signup");

      event.currentTarget.reset();
      setStatus("saved");
      setMessage("You’re in. Your signup has been retained.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to save signup");
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
      <input
        name="name"
        type="text"
        autoComplete="name"
        placeholder="Name"
        className="rounded-md border border-white/15 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-[#c9a84c]"
      />
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address"
        className="rounded-md border border-white/15 bg-black/40 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-[#c9a84c]"
      />
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-md bg-[#c9a84c] px-5 py-3 font-bold text-black transition hover:bg-[#d9bb64] disabled:cursor-wait disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Keep Me Updated"}
      </button>
      {message ? (
        <p
          className={`sm:col-span-3 text-sm ${status === "error" ? "text-red-300" : "text-white/60"}`}
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
