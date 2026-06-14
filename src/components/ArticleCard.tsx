"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { ArticleMeta } from "@/lib/articles";

const ACCENT: Record<ArticleMeta["accent"], string> = {
  lime: "bg-spring",
  teal: "bg-spring-deep",
  sage: "bg-sage",
};

export function ArticleCard({ a }: { a: ArticleMeta }) {
  const { lang, t } = useLang();
  const date = a.date
    ? new Date(`${a.date}T00:00:00`).toLocaleDateString(
        lang === "fr" ? "fr-FR" : "en-US",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : "";

  return (
    <Link
      href={`/journal/${a.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream transition-colors hover:border-spring-deep/40"
    >
      <div className={`h-1.5 ${ACCENT[a.accent]}`} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {a.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-spring/12 px-2.5 py-0.5 text-[0.7rem] font-medium text-moss"
              >
                {tag}
              </span>
            ))}
          </div>
          {typeof a.product?.rating === "number" && (
            <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 font-mono text-[0.72rem] font-medium text-spring">
              {a.product.rating.toFixed(1)}/10
            </span>
          )}
        </div>
        {a.product?.brand && (
          <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-spring-deep">
            {a.product.brand}
          </p>
        )}
        <h3 className="font-display mt-3 text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-spring-deep">
          {a.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-[0.9rem] leading-relaxed text-stone">
          {a.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-stone-2">
          <span>{date}</span>
          <span>
            {a.readingMinutes} {t.journal.minRead}
          </span>
        </div>
      </div>
    </Link>
  );
}
