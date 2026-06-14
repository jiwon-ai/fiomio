"use client";

import { useLang } from "@/lib/i18n";
import { ArticleCard } from "./ArticleCard";
import { NewsletterInline } from "./NewsletterInline";
import { Reveal } from "./ui/Reveal";
import type { ArticleMeta } from "@/lib/articles";

export function JournalIndex({ articles }: { articles: ArticleMeta[] }) {
  const { t } = useLang();
  const j = t.journal;

  return (
    <main className="flex-1">
      {/* dark hero band */}
      <section className="relative overflow-hidden bg-ink pt-32 pb-16 sm:pt-36">
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -right-24 -top-16 size-[30rem] rounded-full bg-spring/10 blur-3xl"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-60" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p className="eyebrow text-spring">{j.eyebrow}</p>
          <h1 className="font-display mt-4 text-4xl font-medium leading-[1.05] tracking-tight text-cream sm:text-5xl">
            {j.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream/65 sm:text-lg">
            {j.intro}
          </p>
        </div>
      </section>

      {/* articles + newsletter */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 70}>
                  <ArticleCard a={a} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-stone">{j.empty}</p>
          )}

          <div className="mt-14">
            <NewsletterInline />
          </div>
        </div>
      </section>
    </main>
  );
}
