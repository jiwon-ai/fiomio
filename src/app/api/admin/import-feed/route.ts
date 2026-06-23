import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseInciList } from "@/lib/inci";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Generic affiliate product-feed importer (e.g. YesStyle via Sovrn). Fetches a
 * CSV feed URL, maps columns heuristically (name / brand / barcode / ingredients
 * / categories), and upserts into `seed_products`. Legitimate, structured data
 * (no scraping). Note: many affiliate feeds omit full INCI — rows are stored with
 * whatever they include; INCI is filled only when the feed provides it.
 *
 * Auth: `?key=IMPORT_SECRET` (or Bearer). Usage:
 *   /api/admin/import-feed?key=...&feed=https://...feed.csv
 */
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

/** Minimal CSV parser (handles quoted fields, commas, CRLF). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c === "\r") {
      /* skip */
    } else cur += c;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows;
}

function findCol(headers: string[], ...needles: string[]): number {
  const lower = headers.map((h) => h.toLowerCase().trim());
  for (const n of needles) {
    const i = lower.findIndex((h) => h.includes(n));
    if (i >= 0) return i;
  }
  return -1;
}

export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const feed = url.searchParams.get("feed");
  if (!feed) {
    return NextResponse.json({ ok: false, error: "missing_feed_url" }, { status: 400 });
  }
  const supaUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!supaUrl || !key) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" });
  }

  let csv: string;
  try {
    const r = await fetch(feed, { headers: { "User-Agent": "Fiomio/1.0 (feed import)" } });
    if (!r.ok) return NextResponse.json({ ok: false, error: `feed_http_${r.status}` });
    csv = await r.text();
  } catch {
    return NextResponse.json({ ok: false, error: "feed_fetch_failed" });
  }

  const rows = parseCsv(csv);
  if (rows.length < 2) return NextResponse.json({ ok: false, error: "feed_empty_or_not_csv" });
  const headers = rows[0];
  const ci = {
    name: findCol(headers, "name", "title", "product"),
    brand: findCol(headers, "brand", "manufacturer"),
    barcode: findCol(headers, "gtin", "ean", "upc", "barcode"),
    inci: findCol(headers, "ingredient", "inci"),
    categories: findCol(headers, "categor"),
  };

  const supabase = createClient(supaUrl, key);
  const records: Record<string, unknown>[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const get = (idx: number) => (idx >= 0 && idx < r.length ? r[idx].trim() : "");
    const barcode = get(ci.barcode);
    if (!barcode) continue; // seed_products PK is barcode
    const inciText = get(ci.inci);
    records.push({
      barcode: barcode.slice(0, 20),
      name: get(ci.name).slice(0, 160),
      brand: get(ci.brand).slice(0, 80) || null,
      inci: inciText ? parseInciList(inciText) : [],
      categories: get(ci.categories) ? [get(ci.categories).slice(0, 60)] : [],
      source: "affiliate-feed",
      updated_at: new Date().toISOString(),
    });
  }
  if (!records.length) {
    return NextResponse.json({
      ok: true,
      imported: 0,
      note: "No rows with a barcode column. Share a sample so the mapping can be tuned.",
      headers,
    });
  }

  let imported = 0;
  for (let i = 0; i < records.length; i += 500) {
    const chunk = records.slice(i, i + 500);
    const { error } = await supabase
      .from("seed_products")
      .upsert(chunk, { onConflict: "barcode" });
    if (error) return NextResponse.json({ ok: false, error: error.message, imported });
    imported += chunk.length;
  }
  return NextResponse.json({ ok: true, imported, columnsDetected: ci });
}
