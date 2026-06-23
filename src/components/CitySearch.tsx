"use client";

import { useEffect, useRef, useState } from "react";
import { geocodeCity, type GeoResult } from "@/lib/geo";

export function CitySearch({
  lang,
  placeholder,
  onSelect,
}: {
  lang: "fr" | "en";
  placeholder: string;
  onSelect: (r: GeoResult) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    let alive = true;
    const id = setTimeout(() => {
      geocodeCity(q, lang).then((r) => {
        if (alive) setResults(r);
      });
    }, 250);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [q, lang]);

  return (
    <div className="relative mt-3 w-full max-w-xs">
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-stone-2 focus:border-spring-deep"
      />
      {results.length > 0 && (
        <ul className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-lg border border-line bg-white py-1 shadow-[0_18px_50px_-24px_rgba(15,43,49,0.45)]">
          {results.map((r, i) => (
            <li key={`${r.name}-${i}`}>
              <button
                type="button"
                onClick={() => onSelect(r)}
                className="flex w-full items-baseline gap-2 px-3.5 py-2 text-left text-sm text-ink transition-colors hover:bg-cream"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-xs text-stone-2">
                  {r.admin1 ? `${r.admin1} · ` : ""}
                  {r.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
