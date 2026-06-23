import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseInciList } from "@/lib/inci";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Seed the proprietary product → INCI database from Open Beauty Facts (open
 * data). Pulls skincare products that actually carry an ingredient list and
 * upserts them into `seed_products` (dedup by barcode). Pre-populates the DB
 * without waiting for users.
 *
 * Auth: `?key=IMPORT_SECRET` for manual runs, or Vercel Cron's
 * `Authorization: Bearer CRON_SECRET`. Sorted by last_modified so the daily
 * cron keeps capturing newly added / edited skincare products.
 */
const OBF = "https://world.openbeautyfacts.org";

// Cosmetic categories to sweep (OBF's beauty DB is small, so we cast wide).
const CATEGORIES = [
  "skin-care",
  "face-care",
  "moisturizers",
  "serums",
  "sunscreens",
  "cleansers",
  "toners",
  "creams",
  "face-masks",
  "eye-contour",
  "anti-aging",
  "day-creams",
  "night-creams",
  "lip-care",
  "hand-care",
  "body-care",
];

function authed(req: Request): boolean {
  const importSecret = process.env.IMPORT_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  if (importSecret && url.searchParams.get("key") === importSecret) return true;
  const auth = req.headers.get("authorization");
  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;
  if (importSecret && auth === `Bearer ${importSecret}`) return true;
  return false;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

async function fetchPage(category: string, page: number) {
  const u =
    `${OBF}/cgi/search.pl?action=process&json=1&page_size=100&page=${page}` +
    `&sort_by=unique_scans_n&tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}` +
    `&fields=code,product_name,product_name_en,brands,categories_tags,ingredients_text,ingredients_text_en,ingredients_text_fr`;
  try {
    const r = await fetch(u, {
      headers: { "User-Agent": "Fiomio/1.0 (skincare data seed; hello@fiomio.io)" },
    });
    if (!r.ok) return [];
    const d = (await r.json()) as { products?: Record<string, unknown>[] };
    return d.products ?? [];
  } catch {
    return [];
  }
}

async function importBatch(startPage: number, pages: number) {
  const supaUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!supaUrl || !key) {
    return { ok: false, error: "supabase_not_configured", imported: 0 };
  }
  const supabase = createClient(supaUrl, key);

  let imported = 0;
  let scanned = 0;
  // Sweep every cosmetic category, `pages` pages each, dedup via upsert.
  for (const category of CATEGORIES) {
    for (let i = 0; i < pages; i++) {
      const prods = await fetchPage(category, startPage + i);
      if (!prods.length) break;
      scanned += prods.length;
      const records = prods
        .map((p) => {
          const inciText =
            str(p.ingredients_text_en) ||
            str(p.ingredients_text) ||
            str(p.ingredients_text_fr);
          return {
            barcode: str(p.code),
            name: (str(p.product_name) || str(p.product_name_en)).slice(0, 160),
            brand: str(p.brands).split(",")[0].trim().slice(0, 80) || null,
            inci: inciText ? parseInciList(inciText) : [],
            categories: Array.isArray(p.categories_tags)
              ? (p.categories_tags as string[]).slice(0, 12)
              : [],
            source: "openbeautyfacts",
            updated_at: new Date().toISOString(),
          };
        })
        .filter((x) => x.barcode && x.inci.length >= 3);
      if (records.length) {
        const { error } = await supabase
          .from("seed_products")
          .upsert(records, { onConflict: "barcode" });
        if (error) return { ok: false, error: error.message, imported, scanned };
        imported += records.length;
      }
    }
  }
  return { ok: true, imported, scanned, nextPage: startPage + pages };
}

export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const pages = Math.min(5, Math.max(1, parseInt(url.searchParams.get("pages") || "2", 10) || 2));
  const res = await importBatch(page, pages);
  return NextResponse.json(res);
}
