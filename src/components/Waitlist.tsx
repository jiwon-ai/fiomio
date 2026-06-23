"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Lang, Messages } from "@/lib/locale";
import {
  getLocation,
  displayPlace,
  geocodeCity,
  type GeoResult,
} from "@/lib/geo";
import { track } from "@/lib/track";
import { Reveal } from "./ui/Reveal";

type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Waitlist({ lang, t }: { lang: Lang; t: Messages }) {
  const w = t.waitlist;
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  // coords match the current city text when known (detected or picked), else null
  const coords = useRef<{ lat: number; lon: number } | null>(null);

  // Pre-fill the city from the auto-detected location (editable).
  useEffect(() => {
    let alive = true;
    getLocation().then((loc) => {
      if (!alive || !loc) return;
      coords.current = { lat: loc.lat, lon: loc.lon };
      setCity((prev) => prev || displayPlace(loc) || loc.city || "");
    });
    return () => {
      alive = false;
    };
  }, []);

  // Autocomplete: only search when the user is typing (no coords yet).
  useEffect(() => {
    if (city.trim().length < 2 || coords.current) {
      setResults([]);
      return;
    }
    let alive = true;
    const id = setTimeout(() => {
      geocodeCity(city, lang).then((r) => {
        if (alive) setResults(r);
      });
    }, 250);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [city, lang]);

  const pickCity = (r: GeoResult) => {
    coords.current = { lat: r.lat, lon: r.lon };
    setCity(r.name);
    setResults([]);
    setOpen(false);
  };

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
        body: JSON.stringify({
          email,
          lang,
          source: "landing",
          city: city.trim() || undefined,
          ...(coords.current
            ? { lat: coords.current.lat, lon: coords.current.lon }
            : {}),
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("success");
      setMessage(w.success);
      setEmail("");
      setCity("");
      coords.current = null;
      setResults([]);
      track("waitlist_submitted", { lang, hasCity: city.trim().length > 0 });
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
            <>
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

              <div className="mx-auto mt-3 flex max-w-md flex-col items-stretch gap-1.5 text-left">
                <div className="relative">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone/50"
                  >
                    <svg width="11" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10z" />
                      <circle cx="12" cy="11" r="2" />
                    </svg>
                  </span>
                  <label htmlFor="wl-city" className="sr-only">
                    {w.cityPlaceholder}
                  </label>
                  <input
                    id="wl-city"
                    type="text"
                    role="combobox"
                    aria-expanded={open && results.length > 0}
                    aria-controls="wl-city-list"
                    aria-autocomplete="list"
                    autoComplete="off"
                    value={city}
                    onChange={(e) => {
                      coords.current = null; // typing = unknown coords until picked
                      setCity(e.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 150)}
                    placeholder={w.cityPlaceholder}
                    className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-5 text-sm text-ink placeholder:text-stone/50 outline-none transition-colors focus:border-spring-deep/40 focus:ring-2 focus:ring-spring/20"
                  />
                  {open && results.length > 0 && (
                    <ul id="wl-city-list" className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-2xl border border-line bg-white py-1 text-left shadow-[0_18px_50px_-24px_rgba(15,43,49,0.45)]">
                      {results.map((r, i) => (
                        <li key={`${r.name}-${i}`}>
                          <button
                            type="button"
                            onMouseDown={(ev) => ev.preventDefault()}
                            onClick={() => pickCity(r)}
                            className="flex w-full items-baseline gap-2 px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-cream"
                          >
                            <span className="font-medium">{r.name}</span>
                            <span className="text-xs text-stone-2">
                              {r.admin1 ? `${r.admin1} · ` : ""}
                              {r.country}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="px-1 text-[0.72rem] leading-snug text-stone/55">
                  {w.cityHint}
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-500">{message}</p>
          )}

          <p className="mx-auto mt-5 max-w-sm text-balance font-mono text-[0.62rem] uppercase leading-relaxed tracking-wider text-stone/45">
            {w.countNote} · {w.privacy}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
