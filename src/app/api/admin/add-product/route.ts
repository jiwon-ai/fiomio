import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Personal capture tool endpoint. Founder-only (key-gated by IMPORT_SECRET):
 * add a cosmetic (any brand) with its INCI to the broad analysis DB
 * (`seed_products`) so it becomes searchable in Affinites right away.
 */
type Body = {
  key?: string;
  brand?: string;
  name?: string;
  barcode?: string;
  inci?: string[];
};

const str = (v: unknown, max = 160) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const secret = process.env.IMPORT_SECRET;
  if (!secret || body.key !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const name = str(body.name, 160);
  const inci = Array.isArray(body.inci)
    ? body.inci.map((x) => str(x, 80)).filter(Boolean).slice(0, 120)
    : [];
  if (!name || inci.length < 2) {
    return NextResponse.json({ ok: false, error: "need_name_and_inci" }, { status: 400 });
  }

  const barcode =
    str(body.barcode, 40) || `cap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 500 });
  }

  try {
    const supabase = createClient(url, key);
    const { error } = await supabase.from("seed_products").upsert(
      {
        barcode,
        name,
        brand: str(body.brand, 80) || null,
        inci,
        categories: [],
        source: "capture",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "barcode" },
    );
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, barcode, inciCount: inci.length });
}
