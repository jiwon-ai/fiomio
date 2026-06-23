"use client";

import type { Lang } from "@/lib/locale";
import { getDictionary } from "@/lib/locale";
import { ArticleCard } from "./ArticleCard";
import { NewsletterInline } from "./NewsletterInline";
import { Reveal } from "./ui/Reveal";
import type { ArticleMeta } from "@/lib/articles";

export function JournalIndex({
  lang,
  articles,
}: {
  lang: Lang;
  articles: ArticleMeta[];
}) {
  const t = getDictionary(lang);
  const j = t.journal;

  return (
    <main className="flex-1">
      {/* dark hero band */}
      <section className="relative overflow-hidden bg-cream pt-32 pb-16 sm:pt-36">
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -right-24 -top-16 size-[30rem] rounded-full bg-spring/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p className="eyebrow text-spring-deep">{j.eyebrow}</p>
          <h1 className="font-display mt-4 text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {j.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">
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
                  <ArticleCard lang={lang} a={a} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-stone">{j.empty}</p>
          )}

          <div className="mt-14">
            <NewsletterInline lang={lang} t={t} />
          </div>
        </div>
      </section>
    </main>
  );
}
