"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang, Messages } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";

export function Nav({ lang, t }: { lang: Lang; t: Messages }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const home = localePath(lang, "/");
  const homePrefix = home === "/" ? "" : home;

  const links = [
    { href: `${homePrefix}/#probleme`, label: t.nav.problem },
    { href: `${homePrefix}/#solution`, label: t.nav.solution },
    { href: `${homePrefix}/#diagnostic`, label: t.nav.diagnostic },
    { href: localePath(lang, "/journal"), label: t.nav.journal },
    { href: localePath(lang, "/ingredients"), label: t.nav.ingredients },
    { href: localePath(lang, "/marques"), label: t.nav.brands },
    { href: localePath(lang, "/mes-produits"), label: t.nav.products },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-cream/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-12">
        <Link href={home} aria-label="Fiomio, accueil">
          <Wordmark className="text-[2rem]" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="link-underline text-sm text-stone transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          <LangToggle lang={lang} />
          <Link
            href={`${homePrefix}/#rejoindre`}
            className="rounded-full bg-spring px-4 py-2 text-sm font-medium text-spring-ink transition-transform hover:-translate-y-0.5 hover:bg-spring/90"
          >
            {t.nav.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
