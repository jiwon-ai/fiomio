"use client";

import { useEffect, useState } from "react";
import { parseInciList } from "@/lib/inci";

/**
 * Founder-only capture tool. Photograph a product label, OCR the INCI,
 * confirm, and add it to the broad analysis DB (seed_products) so it becomes
 * searchable in Affinites. Key-gated by IMPORT_SECRET.
 */
export function CaptureTool() {
  const [key, setKey] = useState("");
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [raw, setRaw] = useState("");
  const [ocrRunning, setOcrRunning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(0);

  useEffect(() => {
    try {
      const k = localStorage.getItem("fiomio:capkey");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (k) setKey(k);
    } catch {
      /* ignore */
    }
  }, []);

  const inci = parseInciList(raw);

  async function runOcr(file: File) {
    setOcrRunning(true);
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(file, "fra+eng");
      setRaw((prev) => (prev ? prev + ", " : "") + data.text);
    } catch {
      setStatus("OCR a échoué, saisissez la liste à la main.");
    }
    setOcrRunning(false);
  }

  async function submit() {
    if (!name.trim() || inci.length < 2) {
      setStatus("Nom et au moins 2 ingrédients requis.");
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      localStorage.setItem("fiomio:capkey", key);
    } catch {
      /* ignore */
    }
    try {
      const r = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, brand, name, barcode, inci }),
      });
      const d = (await r.json()) as { ok: boolean; error?: string; inciCount?: number };
      if (d.ok) {
        setAdded((n) => n + 1);
        setStatus(`Ajouté (${d.inciCount} ingrédients). Suivant.`);
        setName("");
        setBarcode("");
        setRaw("");
      } else {
        setStatus(`Erreur : ${d.error}`);
      }
    } catch {
      setStatus("Échec réseau.");
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-12 sm:px-8">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Fiomio Jiwon
      </h1>
      <p className="mt-1 text-sm text-stone">
        Photographiez la liste d&apos;ingrédients (INCI), confirmez, ajoutez à la base
        d&apos;analyse. Outil personnel, toutes marques.
      </p>
      {added > 0 && (
        <p className="mt-2 text-sm font-medium text-spring-deep">
          {added} produit(s) ajouté(s) cette session.
        </p>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-stone-2" htmlFor="cap-key">
            Clé admin (IMPORT_SECRET)
          </label>
          <input
            id="cap-key"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-spring-deep"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-stone-2" htmlFor="cap-brand">
              Marque
            </label>
            <input
              id="cap-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="La Roche-Posay"
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-spring-deep"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-2" htmlFor="cap-bar">
              Code-barres (optionnel)
            </label>
            <input
              id="cap-bar"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-spring-deep"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-2" htmlFor="cap-name">
            Nom du produit
          </label>
          <input
            id="cap-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cicaplast Baume B5"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-spring-deep"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-2">
            Photo de la liste d&apos;ingrédients
          </label>
          <label className="mt-1 inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-stone transition-colors hover:text-ink">
            {ocrRunning ? "Lecture..." : "Prendre / choisir une photo"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void runOcr(f);
              }}
            />
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-2" htmlFor="cap-raw">
            Texte INCI (modifiable)
          </label>
          <textarea
            id="cap-raw"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={5}
            placeholder="Aqua, Glycerin, Niacinamide, ..."
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-spring-deep"
          />
          <p className="mt-1 text-xs text-stone-2">
            {inci.length} ingrédient(s) détecté(s) : {inci.slice(0, 8).join(", ")}
            {inci.length > 8 ? "..." : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {busy ? "Ajout..." : "Ajouter à la base"}
        </button>

        {status && <p className="text-sm text-stone">{status}</p>}
      </div>
    </main>
  );
}
