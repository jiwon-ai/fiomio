import { dictionaries, type Lang, type Messages } from "./messages";

export const LOCALES = ["fr", "en"] as const;

export type { Lang, Messages };
export { dictionaries };

export function getDictionary(lang: Lang): Messages {
  return dictionaries[lang];
}

/**
 * Build a locale-aware path.
 * - fr (default locale) lives at the root: "/journal" -> "/journal".
 * - en is namespaced under "/en": "/journal" -> "/en/journal", "/" -> "/en".
 */
export function localePath(lang: Lang, path = "/"): string {
  if (lang === "fr") return path;
  if (path === "/") return "/en";
  return `/en${path.startsWith("/") ? "" : "/"}${path}`;
}
