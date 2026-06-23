"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/locale";
import { localePath } from "@/lib/locale";

export function LegalPage({
  lang,
  title,
  updated,
  children,
}: {
  lang: Lang;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const home = lang === "en" ? "Home" : "Accueil";
  const updatedLabel = lang === "en" ? "Last updated" : "Dernière mise à jour";

  return (
    <main className="flex-1">
      <header className="relative overflow-hidden bg-cream pt-28 pb-12 sm:pt-32">
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href={localePath(lang, "/")}
            className="link-underline inline-flex items-center gap-1.5 text-sm text-stone transition-colors hover:text-ink"
          >
            ← {home}
          </Link>
          <h1 className="font-display mt-5 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-[2.5rem]">
            {title}
          </h1>
          <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-widest text-stone/50">
            {updatedLabel} : {updated}
          </p>
        </div>
      </header>

      <section className="bg-paper py-14 sm:py-16">
        <div className="article-prose mx-auto max-w-2xl px-5 sm:px-8">{children}</div>
      </section>
    </main>
  );
}
