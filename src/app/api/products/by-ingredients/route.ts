import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { inciTokensForIds } from "@/lib/diagnostic";

export const runtime = "nodejs";

/** Real catalog products from our seeded DB that contain the recommended
 *  actives (matched on INCI via Postgres array overlap). Read-only. */
export async function GET(req: Request) {
  const ids = (new URL(req.url).searchParams.get("ids") || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 6);
  if (!ids.length) return NextResponse.json({ results: [] });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ results: [] });

  const tokens = inciTokensForIds(ids);
  if (!tokens.length) return NextResponse.json({ results: [] });

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("seed_products")
      .select("barcode,name,brand,inci")
      .overlaps("inci", tokens)
      .limit(8);
    if (error) return NextResponse.json({ results: [] });
    const results = (data ?? [])
      .filter((r) => r.name && Array.isArray(r.inci))
      .map((r) => ({
        barcode: r.barcode as string,
        name: r.name as string,
        brand: (r.brand as string) || undefined,
      }))
      .slice(0, 6);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
