"use client";

/**
 * Thin analytics wrapper over Vercel Web Analytics custom events.
 * Vendor-neutral call-site (`track("event", {...})`) so the provider can be
 * swapped later without touching components. No-ops safely if analytics
 * isn't available (e.g. local dev).
 */
import { track as vercelTrack } from "@vercel/analytics";

export type TrackProps = Record<string, string | number | boolean | null>;

export function track(event: string, props?: TrackProps) {
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics unavailable — never break UX */
  }
}
