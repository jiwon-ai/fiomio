"use client";

import { useLang } from "@/lib/i18n";

export function LangToggle({ onDark = false }: { onDark?: boolean }) {
  const { lang, setLang } = useLang();

  const base =
    "px-2 py-1 text-[0.7rem] font-mono uppercase tracking-widest rounded transition-colors";
  const activeCls = onDark ? "text-spring" : "text-spring-deep";
  const idleCls = onDark
    ? "text-cream/45 hover:text-cream/80"
    : "text-stone hover:text-ink";

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role="group"
      aria-label="Language / Langue"
    >
      {(["fr", "en"] as const).map((l, i) => (
        <span key={l} className="inline-flex items-center">
          {i === 1 && (
            <span
              className={onDark ? "text-cream/25" : "text-line"}
              aria-hidden
            >
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`${base} ${lang === l ? activeCls : idleCls}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
