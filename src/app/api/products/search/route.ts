import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/** Search our own seeded product DB (Open Beauty Facts + crowd + feeds) by name.
 *  Read-only, server-side. Falls back gracefully to an empty list. */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ results: [] });

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("seed_products")
      .select("barcode,name,brand,inci")
      .ilike("name", `%${q}%`)
      .limit(12);
    if (error) return NextResponse.json({ results: [] });
    const results = (data ?? [])
      .filter((r) => Array.isArray(r.inci) && r.inci.length >= 3 && r.name)
      .map((r) => ({
        barcode: r.barcode as string,
        name: r.name as string,
        brand: (r.brand as string) || undefined,
        inci: r.inci as string[],
      }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
