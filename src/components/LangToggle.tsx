"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/locale";

export function LangToggle({
  lang,
  onDark = false,
}: {
  lang: Lang;
  onDark?: boolean;
}) {
  const pathname = usePathname() ?? "/";

  // Strip a leading "/en" to recover the canonical FR path.
  const frPath =
    pathname === "/en"
      ? "/"
      : pathname.startsWith("/en/")
        ? pathname.slice(3)
        : pathname;
  const enPath = frPath === "/" ? "/en" : `/en${frPath}`;

  const hrefFor = (l: Lang) => (l === "fr" ? frPath : enPath);

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
          <Link
            href={hrefFor(l)}
            aria-current={lang === l ? "true" : undefined}
            className={`${base} ${lang === l ? activeCls : idleCls}`}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
