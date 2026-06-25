"use client";

/**
 * Anonymous demand/intent signals for the proprietary dataset, independent of
 * affiliate status. Fire-and-forget via sendBeacon (survives navigation), with
 * a keepalive fetch fallback. Never blocks the UX.
 */
export function logSignal(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/signal", blob);
      return;
    }
    void fetch("/api/signal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break UX */
  }
}
