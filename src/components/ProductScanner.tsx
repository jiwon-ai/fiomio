"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/locale";
import { getDictionary } from "@/lib/locale";
import { track } from "@/lib/track";
import {
  analyzeSuspects,
  parseInciList,
  type LoggedProduct,
  type Suspect,
} from "@/lib/inci";
import {
  fetchByBarcode,
  searchByName,
  type OBFProduct,
} from "@/lib/openbeautyfacts";

const LS_PRODUCTS = "fiomio:products";
const LS_AVOID = "fiomio:avoid";

type Mode = "scan" | "search" | "manual";
type ScanControls = { stop: () => void };

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function ProductScanner({ lang }: { lang: Lang }) {
  const sc = getDictionary(lang).scanner;

  const [mode, setMode] = useState<Mode>("search");
  const [products, setProducts] = useState<LoggedProduct[]>([]);
  const [pending, setPending] = useState<OBFProduct | null>(null);
  const [notice, setNotice] = useState("");

  // search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OBFProduct[]>([]);
  const [searching, setSearching] = useState(false);

  // manual
  const [mName, setMName] = useState("");
  const [mInci, setMInci] = useState("");
  const [ocrRunning, setOcrRunning] = useState(false);

  // scan
  const [scanning, setScanning] = useState(false);
  const [scanErr, setScanErr] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<ScanControls | null>(null);

  const [applied, setApplied] = useState(false);

  // load / persist
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_PRODUCTS);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setProducts(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    try {
      localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
    } catch {
      /* ignore */
    }
  }, [products]);

  const suspects: Suspect[] = analyzeSuspects(products, lang);
  const badCount = products.filter((p) => p.verdict === "bad").length;

  const stopScan = useCallback(() => {
    try {
      controlsRef.current?.stop();
    } catch {
      /* ignore */
    }
    controlsRef.current = null;
    setScanning(false);
  }, []);

  useEffect(() => () => stopScan(), [stopScan]);

  async function ownBarcode(code: string): Promise<OBFProduct | null> {
    try {
      const r = await fetch(`/api/products/barcode?code=${encodeURIComponent(code)}`);
      if (!r.ok) return null;
      const d = (await r.json()) as { product: OBFProduct | null };
      return d.product;
    } catch {
      return null;
    }
  }

  async function lookupBarcode(code: string) {
    setNotice(sc.scanning);
    const p = (await ownBarcode(code)) ?? (await fetchByBarcode(code));
    if (p && p.inci.length) {
      setPending(p);
      setNotice("");
      track("product_found", { via: "barcode" });
    } else {
      setNotice(sc.notFound);
      setMName(p?.name || "");
      setMode("manual");
    }
  }

  async function startScan() {
    setScanErr("");
    try {
      const mod = await import("@zxing/browser");
      const reader = new mod.BrowserMultiFormatReader();
      setScanning(true);
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current ?? undefined,
        (result, _err, ctrls) => {
          if (result) {
            ctrls.stop();
            setScanning(false);
            void lookupBarcode(result.getText());
          }
        },
      );
      controlsRef.current = controls;
    } catch {
      setScanErr(sc.scanUnsupported);
      setScanning(false);
    }
  }

  async function doSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setResults([]);
    let r: OBFProduct[] = [];
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const d = (await res.json()) as { results: OBFProduct[] };
        r = d.results ?? [];
      }
    } catch {
      /* ignore */
    }
    if (!r.length) r = await searchByName(query.trim()); // fallback to Open Beauty Facts
    setResults(r.filter((p) => p.inci.length));
    setSearching(false);
  }

  async function runOcr(file: File) {
    setOcrRunning(true);
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(
        file,
        lang === "fr" ? "fra+eng" : "eng",
      );
      setMInci((prev) => (prev ? prev + ", " : "") + data.text);
    } catch {
      /* ignore */
    }
    setOcrRunning(false);
  }

  function addManual() {
    const inci = parseInciList(mInci);
    if (!inci.length) return;
    setPending({
      name: mName.trim() || (lang === "fr" ? "Produit" : "Product"),
      inci,
    });
  }

  function confirm(verdict: "good" | "bad") {
    if (!pending) return;
    const entry: LoggedProduct = {
      id: uid(),
      name: pending.name,
      brand: pending.brand,
      barcode: pending.barcode,
      inci: pending.inci,
      verdict,
      at: new Date().toISOString(),
    };
    setProducts((prev) => [entry, ...prev]);
    // flywheel: anonymous product + outcome (no email / no IP)
    fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scanId: entry.id,
        barcode: entry.barcode,
        name: entry.name,
        brand: entry.brand,
        inci: entry.inci,
        verdict,
        lang,
      }),
    }).catch(() => {});
    setPending(null);
    setNotice("");
    setQuery("");
    setResults([]);
    setMName("");
    setMInci("");
    setApplied(false);
    track("product_logged", { verdict });
  }

  function remove(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setApplied(false);
  }

  function applyAvoid() {
    const avoid = suspects.map((s) => s.inci);
    try {
      localStorage.setItem(LS_AVOID, JSON.stringify(avoid));
    } catch {
      /* ignore */
    }
    setApplied(true);
    track("avoid_applied", { count: avoid.length });
  }

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <p className="eyebrow text-spring-deep">{sc.eyebrow}</p>
        <h1
          className="font-display mt-4 font-semibold leading-tight tracking-tight text-ink"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
        >
          {sc.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone">
          {sc.intro}
        </p>

        {/* add product */}
        <div className="mt-9 rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {(["scan", "search", "manual"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  if (m !== "scan") stopScan();
                  setMode(m);
                  setNotice("");
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-spring-deep text-cream"
                    : "border border-line bg-white text-stone hover:text-ink"
                }`}
              >
                {m === "scan" ? sc.tabScan : m === "search" ? sc.tabSearch : sc.tabManual}
              </button>
            ))}
          </div>

          {mode === "scan" && (
            <div className="mt-5">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink/90">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
                {!scanning && (
                  <div className="absolute inset-0 grid place-items-center text-center text-sm text-cream/70">
                    {sc.scanHint}
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                {!scanning ? (
                  <button
                    type="button"
                    onClick={startScan}
                    className="rounded-full bg-spring-deep px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
                  >
                    {sc.scanStart}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopScan}
                    className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-stone hover:text-ink"
                  >
                    {sc.scanStop}
                  </button>
                )}
              </div>
              {scanErr && <p className="mt-2 text-sm text-stone-2">{scanErr}</p>}
            </div>
          )}

          {mode === "search" && (
            <div className="mt-5">
              <form onSubmit={doSearch} className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={sc.searchPlaceholder}
                  className="h-11 flex-1 rounded-full border border-line bg-white px-5 text-sm text-ink outline-none transition-colors focus:border-spring-deep/40 focus:ring-2 focus:ring-spring/20"
                />
                <button
                  type="submit"
                  className="rounded-full bg-spring-deep px-5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
                >
                  {searching ? sc.searching : sc.searchBtn}
                </button>
              </form>
              {results.length > 0 && (
                <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
                  {results.map((p, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setPending(p)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-cream"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded bg-spring/15 text-[0.6rem] font-semibold text-spring-deep">
                          INCI
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink">
                            {p.name}
                          </span>
                          <span className="block truncate text-xs text-stone-2">
                            {[p.brand, sc.inciCount.replace("{n}", String(p.inci.length))]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!searching && query.length > 1 && results.length === 0 && (
                <p className="mt-3 text-sm text-stone-2">{sc.noResults}</p>
              )}
            </div>
          )}

          {mode === "manual" && (
            <div className="mt-5 space-y-3">
              <input
                value={mName}
                onChange={(e) => setMName(e.target.value)}
                placeholder={sc.manualName}
                className="h-11 w-full rounded-full border border-line bg-white px-5 text-sm text-ink outline-none focus:border-spring-deep/40 focus:ring-2 focus:ring-spring/20"
              />
              <textarea
                value={mInci}
                onChange={(e) => setMInci(e.target.value)}
                placeholder={sc.manualInciPlaceholder}
                rows={4}
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-spring-deep/40 focus:ring-2 focus:ring-spring/20"
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-stone transition-colors hover:text-ink">
                  {ocrRunning ? sc.ocrRunning : sc.ocrButton}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void runOcr(f);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={addManual}
                  disabled={parseInciList(mInci).length === 0}
                  className="rounded-full bg-spring-deep px-5 py-2 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {sc.addBtn}
                </button>
              </div>
            </div>
          )}

          {notice && <p className="mt-3 text-sm text-stone-2">{notice}</p>}

          {/* pending verdict */}
          {pending && (
            <div className="mt-5 rounded-xl border border-spring-deep/25 bg-spring/8 p-4">
              <p className="text-sm font-medium text-ink">{pending.name}</p>
              <p className="mt-0.5 text-xs text-stone-2">
                {[pending.brand, sc.inciCount.replace("{n}", String(pending.inci.length))]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="mt-3 text-sm font-medium text-ink">{sc.verdictPrompt}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => confirm("good")}
                  className="rounded-full border border-spring-deep/40 bg-white px-4 py-2 text-sm font-medium text-spring-deep transition-colors hover:bg-spring/10"
                >
                  {sc.good}
                </button>
                <button
                  type="button"
                  onClick={() => confirm("bad")}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
                >
                  {sc.bad}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* log */}
        <div className="mt-8">
          <h2 className="font-mono text-[0.7rem] uppercase tracking-widest text-stone-2">
            {sc.logTitle}
          </h2>
          {products.length === 0 ? (
            <p className="mt-3 text-sm text-stone">{sc.empty}</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-3"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`size-2 shrink-0 rounded-full ${
                        p.verdict === "bad" ? "bg-ink" : "bg-spring-deep"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {p.name}
                      </span>
                      <span className="block text-xs text-stone-2">
                        {p.verdict === "bad" ? sc.bad : sc.good}
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="shrink-0 text-xs font-medium text-stone-2 underline-offset-2 hover:text-ink hover:underline"
                  >
                    {sc.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* results */}
        {badCount >= 1 && (
          <div className="mt-8 rounded-2xl bg-ink p-6 text-cream sm:p-8">
            <p className="font-mono text-[0.7rem] uppercase tracking-widest text-spring">
              {sc.resultsTitle}
            </p>
            {suspects.length > 0 ? (
              <>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/75">
                  {sc.resultsIntro}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {suspects.map((s) => (
                    <li
                      key={s.inci}
                      className="rounded-xl border border-cream/15 bg-cream/5 px-3.5 py-2.5"
                    >
                      <span className="block text-sm font-semibold text-cream">
                        {s.label}
                      </span>
                      <span className="mt-0.5 block text-[0.7rem] text-cream/55">
                        {s.knownIrritant ? sc.irritant + " · " : ""}
                        {sc.seenIn
                          .replace("{b}", String(s.badCount))
                          .replace("{tb}", String(s.totalBad))}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-3 border-t border-cream/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-cream">{sc.applyTitle}</p>
                    <p className="mt-0.5 text-xs text-cream/60">{sc.applyBody}</p>
                  </div>
                  <button
                    type="button"
                    onClick={applyAvoid}
                    disabled={applied}
                    className="shrink-0 rounded-full bg-spring px-5 py-2.5 text-sm font-semibold text-spring-ink transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                  >
                    {applied ? sc.applied : sc.applyCta}
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-cream/70">{sc.needMore}</p>
            )}
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-stone-2">{sc.disclaimer}</p>
      </div>
    </section>
  );
}
