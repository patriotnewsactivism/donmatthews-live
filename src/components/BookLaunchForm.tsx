"use client";

import { FormEvent, useMemo, useState } from "react";

type Format = {
  key: string;
  label: string;
  price: string;
  detail: string;
};

export default function BookLaunchForm({ mode, formats }: { mode: "preorder" | "interest"; formats: readonly Format[] }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [format, setFormat] = useState(formats[0]?.key ?? "paperback");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const selected = useMemo(() => formats.find((item) => item.key === format), [format, formats]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/book-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          mode,
          format: mode === "preorder" ? format : undefined,
          price: mode === "preorder" ? selected?.price : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to save your request");
      setStatus("success");
      setMessage(
        mode === "preorder"
          ? `Reserved: ${selected?.label ?? "selected edition"}. We’ll email you when checkout opens.`
          : "You’re on the American Injustice updates list.",
      );
      setEmail("");
      setName("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      {mode === "preorder" ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {formats.map((item) => (
            <label id={`preorder-${item.key}`} key={item.key} className={`cursor-pointer rounded-xl border p-4 transition ${format === item.key ? "border-[#c9a84c] bg-[#c9a84c]/10" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
              <input className="sr-only" type="radio" name="format" value={item.key} checked={format === item.key} onChange={() => setFormat(item.key)} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-white/45">{item.detail}</p>
                </div>
                <span className="shrink-0 font-black text-[#c9a84c]">{item.price}</span>
              </div>
            </label>
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (optional)"
          className="rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#c9a84c]/70"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
          className="rounded-lg border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none placeholder:text-white/25 focus:border-[#c9a84c]/70"
        />
      </div>

      <button disabled={status === "loading"} type="submit" className="w-full rounded-lg bg-[#c9a84c] px-5 py-3.5 font-black text-black transition hover:bg-[#d9bb64] disabled:cursor-wait disabled:opacity-60">
        {status === "loading" ? "Saving…" : mode === "preorder" ? "Reserve This Edition" : "Join the Interest List"}
      </button>

      <p className="text-xs leading-5 text-white/35">
        {mode === "preorder" ? "This records preorder interest; it does not charge your card." : "Book and launch updates only. You can unsubscribe from future mailings."}
      </p>

      {message ? <p role="status" className={`text-sm font-semibold ${status === "success" ? "text-[#c9a84c]" : "text-red-300"}`}>{message}</p> : null}
    </form>
  );
}
