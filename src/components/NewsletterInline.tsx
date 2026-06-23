"use client";

import { useState, type FormEvent } from "react";
import type { Lang, Messages } from "@/lib/locale";

type Status = "idle" | "sending" | "success" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterInline({ lang, t }: { lang: Lang; t: Messages }) {
  const j = t.journal;
  const w = t.waitlist;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setMessage(w.errorEmail);
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, source: "journal" }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("success");
      setMessage(w.success);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(w.errorGeneric);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink p-7 text-cream sm:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-spring/12 blur-3xl"
      />
      <div className="relative">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-spring">
          {j.newsletterEyebrow}
        </p>
        <h3 className="font-display mt-3 text-2xl font-semibold leading-tight text-cream">
          {j.newsletterTitle}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/65">
          {j.newsletterBody}
        </p>

        {status === "success" ? (
          <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-spring/40 bg-spring/10 px-5 py-3">
            <span className="grid size-5 place-items-center rounded-full bg-spring text-spring-ink">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6.2l2.2 2.3L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-sm font-medium text-cream">{message}</span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor="nl-email" className="sr-only">
              {w.placeholder}
            </label>
            <input
              id="nl-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder={w.placeholder}
              className="h-12 flex-1 rounded-full border border-cream/15 bg-white/[0.04] px-5 text-sm text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-spring/60 focus:bg-white/[0.07]"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="spring-glow inline-flex h-12 items-center justify-center rounded-full bg-spring px-6 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
            >
              {status === "sending" ? w.sending : j.newsletterButton}
            </button>
          </form>
        )}

        {status === "error" && <p className="mt-3 text-sm text-[#ff8a8a]">{message}</p>}
      </div>
    </div>
  );
}
