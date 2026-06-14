/* ============================================================
   FIOMIO — Open-Meteo forecast (server-side)
   Free, no API key. Pulls the forecast for the USER's location
   and averages the "delivery window" (≈ J+5 → J+12) — the week
   the ordered products will actually be received and first used.
   ============================================================ */

import { deriveClimate, type ClimateContext } from "./climate";

function mean(xs: number[]): number {
  const v = xs.filter((x) => typeof x === "number" && !Number.isNaN(x));
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0;
}

/**
 * Fetch the forecast for (lat, lon) and build a ClimateContext for the
 * delivery window [startDay, endDay] (days from today). `city` is the
 * resolved location label shown to the user.
 * Returns null on any failure — callers fall back to the season model.
 */
export async function fetchClimate(
  lat: number,
  lon: number,
  city?: string,
  startDay = 5,
  endDay = 12,
): Promise<ClimateContext | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&timezone=auto&forecast_days=16` +
    `&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum` +
    `&hourly=relative_humidity_2m`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const d = await res.json();

    const days: string[] | undefined = d?.daily?.time;
    const tmax: number[] | undefined = d?.daily?.temperature_2m_max;
    const tmin: number[] | undefined = d?.daily?.temperature_2m_min;
    const uvMax: number[] | undefined = d?.daily?.uv_index_max;
    const precip: number[] | undefined = d?.daily?.precipitation_sum;
    if (!days || !tmax || !tmin || !uvMax) return null;

    const lo = Math.min(startDay, days.length - 1);
    const hi = Math.min(endDay, days.length - 1);
    const idx: number[] = [];
    for (let i = lo; i <= hi; i++) idx.push(i);

    const temp = mean(idx.map((i) => (tmax[i] + tmin[i]) / 2));
    const uv = Math.max(...idx.map((i) => uvMax[i] ?? 0));
    const precipMm = idx.reduce((s, i) => s + (precip?.[i] ?? 0), 0);

    const rh: number[] | undefined = d?.hourly?.relative_humidity_2m;
    let humidity = 60;
    if (rh && rh.length >= (hi + 1) * 24) {
      const hours: number[] = [];
      for (let i = lo; i <= hi; i++)
        for (let h = 0; h < 24; h++) hours.push(rh[i * 24 + h]);
      humidity = mean(hours);
    }

    return deriveClimate(
      { tempC: temp, humidity, uv, precipMm },
      days[lo],
      days[hi],
      city,
    );
  } catch {
    return null;
  }
}

/** Default location for France-first launch when nothing else is known. */
export const DEFAULT_LOCATION = { city: "Paris", lat: 48.8566, lon: 2.3522 };
