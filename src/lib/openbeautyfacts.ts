/* ============================================================
   FIOMIO — Open Beauty Facts client (open data, like Open Food
   Facts). Barcode → product + INCI, and name search. Used by the
   product-elimination feature. Coverage is partial (esp. K-beauty),
   so the UI always offers a manual / OCR fallback.
   ============================================================ */

import { parseInciList } from "./inci";

export type OBFProduct = {
  barcode?: string;
  name: string;
  brand?: string;
  inciText?: string;
  inci: string[];
  imageUrl?: string;
};

const BASE = "https://world.openbeautyfacts.org";
const FIELDS =
  "code,product_name,product_name_en,product_name_fr,brands,ingredients_text,ingredients_text_en,ingredients_text_fr,image_front_small_url,image_small_url";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function pick(p: Record<string, unknown>): OBFProduct {
  const inciText =
    str(p.ingredients_text_en) ||
    str(p.ingredients_text) ||
    str(p.ingredients_text_fr);
  const name =
    str(p.product_name) || str(p.product_name_en) || str(p.product_name_fr);
  const brand = str(p.brands).split(",")[0].trim();
  return {
    barcode: str(p.code) || undefined,
    name,
    brand: brand || undefined,
    inciText: inciText || undefined,
    inci: inciText ? parseInciList(inciText) : [],
    imageUrl: str(p.image_front_small_url) || str(p.image_small_url) || undefined,
  };
}

export async function fetchByBarcode(barcode: string): Promise<OBFProduct | null> {
  try {
    const r = await fetch(
      `${BASE}/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`,
    );
    if (!r.ok) return null;
    const d = (await r.json()) as {
      status?: number;
      product?: Record<string, unknown>;
    };
    if (d.status !== 1 || !d.product) return null;
    return pick(d.product);
  } catch {
    return null;
  }
}

export async function searchByName(q: string): Promise<OBFProduct[]> {
  try {
    const url = `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(
      q,
    )}&search_simple=1&action=process&json=1&page_size=12&fields=${FIELDS}`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const d = (await r.json()) as { products?: Record<string, unknown>[] };
    return (d.products || [])
      .map(pick)
      .filter((p) => p.name)
      .slice(0, 12);
  } catch {
    return [];
  }
}
