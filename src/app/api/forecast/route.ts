import { NextResponse } from "next/server";
import { fetchClimate, DEFAULT_LOCATION } from "@/lib/weather";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const latP = parseFloat(searchParams.get("lat") ?? "");
  const lonP = parseFloat(searchParams.get("lon") ?? "");
  const cityP = searchParams.get("city") ?? undefined;

  let lat: number, lon: number, city: string | undefined;
  if (Number.isFinite(latP) && Number.isFinite(lonP)) {
    // explicit coords (client geolocation / city selector)
    lat = latP;
    lon = lonP;
    city = cityP;
  } else {
    // Vercel edge geo headers (production) → user's own location
    const hLat = parseFloat(req.headers.get("x-vercel-ip-latitude") ?? "");
    const hLon = parseFloat(req.headers.get("x-vercel-ip-longitude") ?? "");
    const hCity = req.headers.get("x-vercel-ip-city");
    if (Number.isFinite(hLat) && Number.isFinite(hLon)) {
      lat = hLat;
      lon = hLon;
      city = hCity ? decodeURIComponent(hCity) : undefined;
    } else {
      lat = DEFAULT_LOCATION.lat;
      lon = DEFAULT_LOCATION.lon;
      city = DEFAULT_LOCATION.city;
    }
  }

  const climate = await fetchClimate(lat, lon, city);
  if (!climate) {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json(
    { ok: true, climate },
    {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    },
  );
}
