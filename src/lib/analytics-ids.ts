"use client";

/**
 * First-party, no-PII identifiers used to stitch the anonymous event funnel
 * (search -> diagnostic -> impression -> click) for the future recommendation
 * model. No email, no IP, no fingerprinting: just random UUIDs in browser
 * storage that the user can clear at any time.
 *
 *  - anon_id    : persists across sessions (localStorage). A stable "who".
 *  - session_id : per browser session (sessionStorage). One visit.
 */
const ANON_KEY = "fio_anon_id";
const SESSION_KEY = "fio_session_id";

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function read(storage: "local" | "session", key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const store = storage === "local" ? window.localStorage : window.sessionStorage;
    let v = store.getItem(key);
    if (!v) {
      v = uuid();
      store.setItem(key, v);
    }
    return v;
  } catch {
    return null; // private mode / storage disabled -> degrade silently
  }
}

export function getAnonId(): string | null {
  return read("local", ANON_KEY);
}

export function getSessionId(): string | null {
  return read("session", SESSION_KEY);
}

export function getAnalyticsIds(): { anonId: string | null; sessionId: string | null } {
  return { anonId: getAnonId(), sessionId: getSessionId() };
}
