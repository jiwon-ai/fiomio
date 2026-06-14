"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { dictionaries, type Lang, type Messages } from "./messages";

type I18nContext = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: Messages;
};

const Ctx = createContext<I18nContext | null>(null);

const STORAGE_KEY = "fiomio.lang";

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "fr";
  const params = new URLSearchParams(window.location.search);
  const q = params.get("lang");
  if (q === "fr" || q === "en") return q;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "fr" || stored === "en") return stored;
  // Default to French (target market); fall back to EN only for clearly EN browsers.
  const nav = window.navigator.language?.toLowerCase() ?? "fr";
  return nav.startsWith("fr") ? "fr" : nav.startsWith("en") ? "en" : "fr";
}

export function LangProvider({ children }: { children: ReactNode }) {
  // Server + first client render must agree → start at "fr", reconcile in effect.
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const initial = detectInitialLang();
    setLangState(initial);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "fr" ? "en" : "fr");
  }, [lang, setLang]);

  return (
    <Ctx.Provider value={{ lang, setLang, toggle, t: dictionaries[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang(): I18nContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
