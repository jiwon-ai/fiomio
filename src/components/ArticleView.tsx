"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { NewsletterInline } from "./NewsletterInline";
import { ArticleCard } from "./ArticleCard";
import type { Article, ArticleMeta } from "@/lib/articles";

export function ArticleView({
  article,
  related,
}: {
  article: Article;
  related: ArticleMeta[];
}) {
  const { lang, t } = useLang();
  const j = t.journal;
  const date = article.date
    ? new Date(`${article.date}T00:00:00`).toLocaleDateString(
        lang === "fr" ? "fr-FR" : "en-US",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : "";

  return (
    <main className="flex-1">
      {/* dark header band */}
      <header className="relative overflow-hidden bg-ink pt-28 pb-12 sm:pt-32">
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-50" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href="/journal"
            className="link-underline inline-flex items-center gap-1.5 text-sm text-cream/60 transition-colors hover:text-cream"
          >
            ← {j.backToJournal}
          </Link>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-spring/25 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-spring"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-display mt-4 text-3xl font-medium leading-tight tracking-tight text-cream sm:text-[2.7rem]">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cream/50">
            <span>{date}</span>
            <span aria-hidden>·</span>
            <span>
              {article.readingMinutes} {j.minRead}
            </span>
            <span aria-hidden>·</span>
            <span>
              {j.by} {article.author}
            </span>
          </div>
        </div>
      </header>

      {/* body */}
      <article className="bg-paper py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </div>
      </article>

      {/* newsletter + related */}
      <section className="bg-paper-2 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <NewsletterInline />

          {related.length > 0 && (
            <div className="mt-14">
              <p className="eyebrow">{j.backToJournal}</p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {related.map((a) => (
                  <ArticleCard key={a.slug} a={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
