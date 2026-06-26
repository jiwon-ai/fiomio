import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Anonymous demand signals (no email / no IP), best-effort:
 *  - kind "click"  : a user opened a recommended product (intent to buy),
 *                    logged whether or not an affiliate link exists yet.
 *  - kind "search" : what users look for in Affinites, incl. misses, so we
 *                    know what to add and what is in demand.
 */
type ImprItem = {
  productId?: string;
  brand?: string;
  productName?: string;
  activeId?: string;
  rank?: number;
};

type Body = {
  kind?: string;
  productName?: string;
  brand?: string;
  activeId?: string;
  source?: string;
  city?: string;
  region?: string;
  season?: string;
  tempC?: number;
  humidity?: number;
  uv?: number;
  query?: string;
  resultCount?: number;
  found?: boolean;
  // funnel keys + versioning (no PII)
  diagId?: string;
  anonId?: string;
  sessionId?: string;
  productId?: string;
  barcode?: string;
  rank?: number;
  engineVersion?: string;
  schemaVersion?: string;
  items?: ImprItem[];
  lang?: string;
};

const str = (v: unknown, max = 80) =>
  typeof v === "string" ? v.slice(0, max) : null;
const num = (v: unknown) => (typeof v === "number" ? v : null);
const intIn = (v: unknown) => (typeof v === "number" ? Math.round(v) : null);

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const lang = body.lang === "en" ? "en" : "fr";
  let table: string | null = null;
  let record: Record<string, unknown> | null = null;

  if (body.kind === "click") {
    table = "product_clicks";
    record = {
      product_name: str(body.productName, 120),
      brand: str(body.brand, 80),
      active_id: str(body.activeId, 40),
      source: str(body.source, 30),
      city: str(body.city, 60),
      region: str(body.region, 80),
      season: str(body.season, 30),
      temp_c: num(body.tempC),
      humidity: num(body.humidity),
      uv: num(body.uv),
      diag_id: str(body.diagId, 64),
      anon_id: str(body.anonId, 64),
      session_id: str(body.sessionId, 64),
      product_id: str(body.productId, 80),
      barcode: str(body.barcode, 40),
      rank: intIn(body.rank),
      engine_version: str(body.engineVersion, 20),
      schema_version: str(body.schemaVersion, 10),
      lang,
      created_at: new Date().toISOString(),
    };
  } else if (body.kind === "search") {
    table = "search_queries";
    record = {
      query: str(body.query, 120),
      result_count:
        typeof body.resultCount === "number"
          ? Math.min(Math.max(0, Math.round(body.resultCount)), 9999)
          : null,
      found: typeof body.found === "boolean" ? body.found : null,
      city: str(body.city, 60),
      anon_id: str(body.anonId, 64),
      session_id: str(body.sessionId, 64),
      schema_version: str(body.schemaVersion, 10),
      lang,
      created_at: new Date().toISOString(),
    };
  } else if (body.kind === "impression") {
    // one row per shown product -> CTR denominator + negative samples
    const items = Array.isArray(body.items) ? body.items.slice(0, 24) : [];
    if (!items.length) return NextResponse.json({ ok: true });
    const now = new Date().toISOString();
    const rows = items.map((it) => ({
      diag_id: str(body.diagId, 64),
      anon_id: str(body.anonId, 64),
      session_id: str(body.sessionId, 64),
      product_id: str(it.productId, 80),
      brand: str(it.brand, 80),
      product_name: str(it.productName, 120),
      active_id: str(it.activeId, 40),
      rank: intIn(it.rank),
      source: str(body.source, 30),
      city: str(body.city, 60),
      season: str(body.season, 30),
      temp_c: num(body.tempC),
      humidity: num(body.humidity),
      uv: num(body.uv),
      engine_version: str(body.engineVersion, 20),
      schema_version: str(body.schemaVersion, 10),
      lang,
      created_at: now,
    }));
    const u = process.env.SUPABASE_URL;
    const k = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
    if (u && k) {
      try {
        const supabase = createClient(u, k);
        const { error } = await supabase.from("product_impressions").insert(rows);
        if (error) console.error("[signal] impression insert:", error.message);
      } catch (err) {
        console.error("[signal] impression failed:", err);
      }
    }
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ ok: true });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { error } = await supabase.from(table).insert(record);
      if (error) console.error("[signal] supabase insert:", error.message);
    } catch (err) {
      console.error("[signal] supabase failed:", err);
    }
  }
  return NextResponse.json({ ok: true });
}
