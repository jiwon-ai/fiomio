/* ============================================================
   FIOMIO — location resolution
   The climate is about where the USER is, not Paris. France-first,
   but the engine must work for any European city (and beyond).
   - detectLocation: IP-based, automatic, no permission prompt
   - geocodeCity: free Open-Meteo geocoding for the city selector
   All keyless, client-callable.
   ============================================================ */

export type Loc = { city: string; lat: number; lon: number; country?: string; region?: string };

/** Auto-detect the visitor's city from their IP (no permission prompt).
 *  Tries two keyless providers; on Vercel the API route also reads the
 *  edge geo headers as a server-side fallback. */
export async function detectLocation(): Promise<Loc | null> {
  // 1) ipwho.is
  try {
    const res = await fetch("https://ipwho.is/");
    if (res.ok) {
      const d = await res.json();
      if (d && d.success !== false && typeof d.latitude === "number") {
        return {
          city: d.city || d.region || "",
          lat: d.latitude,
          lon: d.longitude,
          country: d.country_code,
          region: d.region || undefined,
        };
      }
    }
  } catch {
    /* try next */
  }
  // 2) ipapi.co fallback
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const d = await res.json();
      if (d && typeof d.latitude === "number") {
        return {
          city: d.city || d.region || "",
          lat: d.latitude,
          lon: d.longitude,
          country: d.country_code,
          region: d.region || undefined,
        };
      }
    }
  } catch {
    /* give up */
  }
  return null;
}

/** Cached single detection shared across components (avoids duplicate IP calls). */
let _locPromise: Promise<Loc | null> | null = null;
export function getLocation(): Promise<Loc | null> {
  if (!_locPromise) _locPromise = detectLocation();
  return _locPromise;
}

/** Broad, privacy-friendly place label for display.
 *  On public Wi-Fi, IP geolocation often resolves to a small ISP town
 *  (e.g. "Milly-la-Forêt" near Paris). We show the wider region instead
 *  (e.g. "Île-de-France"), which stays correct for the user's climate.
 *  The precise lat/lon is still used for the forecast — only the LABEL widens. */
export function displayPlace(loc: Loc | null): string {
  if (!loc) return "";
  return loc.region || loc.city || "";
}

export type GeoResult = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  admin1?: string;
};

/** Search cities by name (for the "change my city" selector). */
export async function geocodeCity(
  query: string,
  lang: "fr" | "en" = "fr",
): Promise<GeoResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        q,
      )}&count=6&language=${lang}&format=json`,
    );
    if (!res.ok) return [];
    const d = await res.json();
    if (!Array.isArray(d?.results)) return [];
    return d.results.map(
      (r: {
        name: string;
        latitude: number;
        longitude: number;
        country?: string;
        country_code?: string;
        admin1?: string;
      }) => ({
        name: r.name,
        lat: r.latitude,
        lon: r.longitude,
        country: r.country_code ?? r.country ?? "",
        admin1: r.admin1,
      }),
    );
  } catch {
    return [];
  }
}
