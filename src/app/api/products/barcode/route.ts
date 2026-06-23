import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/** Look up a barcode in our own seeded product DB. Read-only, server-side. */
export async function GET(req: Request) {
  const code = (new URL(req.url).searchParams.get("code") || "").trim();
  if (!code) return NextResponse.json({ product: null });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ product: null });

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("seed_products")
      .select("barcode,name,brand,inci")
      .eq("barcode", code)
      .maybeSingle();
    if (error || !data || !Array.isArray(data.inci) || data.inci.length < 3) {
      return NextResponse.json({ product: null });
    }
    return NextResponse.json({
      product: {
        barcode: data.barcode,
        name: data.name,
        brand: data.brand || undefined,
        inci: data.inci,
      },
    });
  } catch {
    return NextResponse.json({ product: null });
  }
}
