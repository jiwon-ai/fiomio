"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang, Messages } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";

export function Nav({ lang, t }: { lang: Lang; t: Messages }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const home = localePath(lang, "/");
  const homePrefix = home === "/" ? "" : home;

  const links = [
    { href: `${homePrefix}/#diagnostic`, label: t.nav.diagnostic },
    { href: localePath(lang, "/ingredients"), label: t.nav.ingredients },
    { href: localePath(lang, "/mes-produits"), label: t.nav.products },
    { href: localePath(lang, "/journal"), label: t.nav.journal },
  ];

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-line bg-cream/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-12">
        <Link href={home} aria-label="Fiomio, accueil" onClick={() => setOpen(false)}>
          <Wordmark className="text-[2rem]" />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="link-underline whitespace-nowrap text-sm text-stone transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={localePath(lang, "/compte")}
            className="hidden items-center gap-1.5 whitespace-nowrap border-r border-line pr-3 text-sm font-semibold text-ink transition-colors hover:text-spring-deep md:inline-flex"
          >
            <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
            {t.nav.account}
          </Link>
          <LangToggle lang={lang} />
          <Link
            href={`${homePrefix}/#rejoindre`}
            className="hidden rounded-full bg-spring-deep px-4 py-2 text-sm font-medium text-cream transition-transform hover:-translate-y-0.5 sm:inline-flex"
            onClick={() => setOpen(false)}
          >
            {t.nav.cta}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink md:hidden"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-line bg-cream/98 backdrop-blur-md md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-spring/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={localePath(lang, "/compte")}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-ink transition-colors hover:bg-spring/10"
              >
                <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
                {t.nav.account}
              </Link>
            </li>
            <li className="mt-2">
              <Link
                href={`${homePrefix}/#rejoindre`}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-spring-deep px-5 py-3 text-center text-base font-semibold text-cream"
              >
                {t.nav.cta}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
