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
      className="relative overflow-hidden bg-void py-28 sm:py-36"
    >
      {/* Spring glow */}
      <div
        aria-hidden
        className="animate-float-slow pointer-events-none absolute left-1/2 top-0 size-[44rem] -translate-x-1/2 rounded-full bg-spring/[0.08] blur-[90px]"
      />
      <div className="relative z-10 mx-auto max-w-xl px-6 text-center sm:px-10">
        <Reveal>
          <p className="eyebrow">{w.eyebrow}</p>
          <h2
            className="font-editorial mt-5 font-light leading-tight tracking-tight text-cream"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {w.title}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base font-light leading-relaxed text-cream/45">
            {w.body}
          </p>

          {status === "success" ? (
            <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 border border-spring/30 bg-spring/[0.06] px-6 py-4">
              <span className="grid size-5 place-items-center rounded-full bg-spring text-void">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
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
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
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
                className="h-12 flex-1 border border-line-void bg-white/[0.03] px-5 py-3 text-sm text-cream placeholder:text-cream/28 outline-none transition-colors focus:border-spring/40 focus:bg-white/[0.06]"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 items-center justify-center bg-spring px-6 text-sm font-semibold text-void transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? w.sending : w.button}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-[#ff8a8a]">{message}</p>
          )}

          <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-widest text-cream/25">
            {w.countNote} · {w.privacy}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
