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
type Body = {
  kind?: string;
  productName?: string;
  brand?: string;
  activeId?: string;
  source?: string;
  city?: string;
  season?: string;
  query?: string;
  resultCount?: number;
  found?: boolean;
  lang?: string;
};

const str = (v: unknown, max = 80) =>
  typeof v === "string" ? v.slice(0, max) : null;

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
      season: str(body.season, 30),
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
      lang,
      created_at: new Date().toISOString(),
    };
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
