import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Founder-only (key-gated). Uploads one product photo (barcode/front/back/
 * ingredients) to Supabase Storage bucket "product-photos" and records it in
 * the product_photos table, keyed by barcode. Builds a raw-image dataset
 * alongside the structured seed_products data.
 */
type Body = { key?: string; barcode?: string; label?: string; imageBase64?: string };

const safe = (v: unknown, max = 40) =>
  typeof v === "string" ? v.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, max) : "";

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

  const img = typeof body.imageBase64 === "string" ? body.imageBase64 : "";
  if (!img) {
    return NextResponse.json({ ok: false, error: "no_image" }, { status: 400 });
  }
  const base64 = img.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  const barcode = safe(body.barcode, 40) || "nobarcode";
  const label = safe(body.label, 20) || "photo";
  const path = `${barcode}/${label}-${Date.now()}.jpg`;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 500 });
  }

  try {
    const supabase = createClient(url, key);
    const { error: upErr } = await supabase.storage
      .from("product-photos")
      .upload(path, buffer, { contentType: "image/jpeg", upsert: true });
    if (upErr) {
      return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });
    }
    const { data: pub } = supabase.storage.from("product-photos").getPublicUrl(path);
    const publicUrl = pub.publicUrl;
    await supabase
      .from("product_photos")
      .insert({ barcode: typeof body.barcode === "string" ? body.barcode.slice(0, 60) : null, label: typeof body.label === "string" ? body.label.slice(0, 30) : null, url: publicUrl });
    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
