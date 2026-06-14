import { NextResponse } from "next/server";
import { fetchParisClimate } from "@/lib/weather";

export const runtime = "nodejs";
// Cache the computed forecast for 30 min — same for every visitor.
export const revalidate = 1800;

export async function GET() {
  const climate = await fetchParisClimate();
  if (!climate) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json(
    { ok: true, climate },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } },
  );
}
