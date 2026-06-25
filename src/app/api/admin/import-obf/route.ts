import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseInciList } from "@/lib/inci";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Seed the proprietary product -> INCI database from Open Beauty Facts (open
 * data). Two modes:
 *   - default ("categories"): sweep cosmetic categories (broad).
 *   - "brands": sweep curated K-beauty brands (on-vertical catalogue growth).
 * Upserts into `seed_products` (dedup by barcode). Affiliate-independent.
 *
 * Auth: `?key=IMPORT_SECRET` or Vercel Cron `Authorization: Bearer CRON_SECRET`.
 * Params: `?mode=brands|categories`, `?page=1`, `?pages=2` (max 5).
 */
const OBF = "https://world.openbeautyfacts.org";

const CATEGORIES = [
  "skin-care", "face-care", "moisturizers", "serums", "sunscreens",
  "cleansers", "toners", "creams", "face-masks", "eye-contour",
  "anti-aging", "day-creams", "night-creams", "lip-care", "hand-care",
  "body-care", "facial-creams", "ampoules", "essences", "exfoliants",
  "eye-creams", "micellar-waters", "lotions", "facial-cleansing",
  "make-up-removers", "balms", "gels", "mists", "peelings", "scrubs",
];

// Curated K-beauty brands to sweep specifically.
const KBEAUTY_BRANDS = [
  "cosrx", "beauty of joseon", "some by mi", "anua", "round lab", "innisfree",
  "laneige", "etude", "missha", "torriden", "mixsoon", "skin1004", "medicube",
  "numbuzin", "isntree", "purito", "dr jart", "klairs", "i'm from",
  "haruharu wonder", "pyunkang yul", "tirtir", "abib", "mediheal", "heimish",
  "axis-y", "sulwhasoo", "goodal", "one thing",
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

async function fetchTag(tagtype: string, tag: string, page: number) {
  const u =
    `${OBF}/cgi/search.pl?action=process&json=1&page_size=100&page=${page}` +
    `&sort_by=unique_scans_n&tagtype_0=${tagtype}&tag_contains_0=contains&tag_0=${encodeURIComponent(tag)}` +
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

function toRecord(p: Record<string, unknown>) {
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
}

async function importByTags(
  tagtype: string,
  tags: string[],
  startPage: number,
  pages: number,
) {
  const supaUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!supaUrl || !key) {
    return { ok: false, error: "supabase_not_configured", imported: 0 };
  }
  const supabase = createClient(supaUrl, key);

  let imported = 0;
  let scanned = 0;
  for (const tag of tags) {
    for (let i = 0; i < pages; i++) {
      const prods = await fetchTag(tagtype, tag, startPage + i);
      if (!prods.length) break;
      scanned += prods.length;
      const records = prods
        .map(toRecord)
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
  const mode = url.searchParams.get("mode") === "brands" ? "brands" : "categories";
  const res =
    mode === "brands"
      ? await importByTags("brands", KBEAUTY_BRANDS, page, pages)
      : await importByTags("categories", CATEGORIES, page, pages);
  return NextResponse.json({ mode, ...res });
}
