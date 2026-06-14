"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";

export function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#probleme", label: t.nav.problem },
    { href: "/#solution", label: t.nav.solution },
    { href: "/#diagnostic", label: t.nav.diagnostic },
    { href: "/#marche", label: t.nav.market },
    { href: "/journal", label: t.nav.journal },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line-dark bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="text-xl" aria-label="Fiomio — accueil">
          <Wordmark onDark />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="link-underline text-sm text-cream/65 transition-colors hover:text-cream"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          <LangToggle onDark />
          <Link
            href="/#rejoindre"
            className="rounded-full bg-spring px-4 py-2 text-sm font-medium text-spring-ink transition-transform hover:-translate-y-0.5 hover:bg-spring/90"
          >
            {t.nav.cta}
          </Link>
        </div>
      </nav>
    </header>
  );
}
