import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchByBarcode } from "@/lib/openbeautyfacts";

export const runtime = "nodejs";

/**
 * Barcode lookup. Checks our own seeded DB first (fast, owned), then falls back
 * to Open Beauty Facts (the open barcode -> product database) so new products
 * are auto-filled with name, brand and INCI without OCR.
 */
export async function GET(req: Request) {
  const code = (new URL(req.url).searchParams.get("code") || "").trim();
  if (!code) return NextResponse.json({ product: null });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const supabase = createClient(url, key);
      const { data } = await supabase
        .from("seed_products")
        .select("barcode,name,brand,inci")
        .eq("barcode", code)
        .maybeSingle();
      if (data && Array.isArray(data.inci) && data.inci.length >= 3) {
        return NextResponse.json({
          product: {
            barcode: data.barcode,
            name: data.name,
            brand: data.brand || undefined,
            inci: data.inci,
            source: "fiomio",
          },
        });
      }
    } catch {
      /* fall through to OBF */
    }
  }

  // Fallback: Open Beauty Facts live lookup.
  try {
    const obf = await fetchByBarcode(code);
    if (obf && Array.isArray(obf.inci) && obf.inci.length >= 2) {
      return NextResponse.json({
        product: {
          barcode: code,
          name: obf.name,
          brand: obf.brand || undefined,
          inci: obf.inci,
          source: "obf",
        },
      });
    }
  } catch {
    /* ignore */
  }

  return NextResponse.json({ product: null });
}
