"use client";

import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/i18n";
import { Reveal } from "./ui/Reveal";

type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Waitlist() {
  const { lang, t } = useLang();
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
        body: JSON.stringify({ email, lang, source: "landing" }),
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
    <section
      id="rejoindre"
      className="relative overflow-hidden bg-paper py-28 sm:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dot-grid opacity-60"
      />
      <div className="relative z-10 mx-auto max-w-xl px-6 text-center sm:px-10">
        <Reveal>
          <p className="eyebrow">{w.eyebrow}</p>
          <h2
            className="font-display mt-5 font-medium leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)" }}
          >
            {w.title}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-stone">
            {w.body}
          </p>

          {status === "success" ? (
            <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-full border border-spring/40 bg-spring/10 px-6 py-4">
              <span className="grid size-6 place-items-center rounded-full bg-spring text-spring-ink">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.2l2.2 2.3L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm font-medium text-ink">{message}</span>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
              noValidate
            >
              <label htmlFor="wl-email" className="sr-only">
                {w.placeholder}
              </label>
              <input
                id="wl-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder={w.placeholder}
                className="h-13 flex-1 rounded-full border border-line bg-white px-5 py-3.5 text-sm text-ink placeholder:text-stone/50 outline-none transition-colors focus:border-spring-deep/40 focus:ring-2 focus:ring-spring/20"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="spring-glow inline-flex h-13 items-center justify-center rounded-full bg-spring px-6 py-3.5 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
              >
                {status === "sending" ? w.sending : w.button}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-500">{message}</p>
          )}

          <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-widest text-stone/45">
            {w.countNote} · {w.privacy}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
