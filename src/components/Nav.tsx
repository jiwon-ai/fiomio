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
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled ? "border-b border-line-void bg-void/80 backdrop-blur-md" : ""
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-12">
        <Link href="/" aria-label="Fiomio — accueil">
          <Wordmark onDark />
        </Link>

        {/* Center: ultra-subtle links */}
        <ul className="hidden items-center gap-10 md:flex">
          <li>
            <Link
              href="/#diagnostic"
              className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cream/30 transition-colors hover:text-cream/70"
            >
              {t.nav.diagnostic}
            </Link>
          </li>
          <li>
            <Link
              href="/journal"
              className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-cream/30 transition-colors hover:text-cream/70"
            >
              {t.nav.journal}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-5">
          <LangToggle onDark />
          <Link
            href="/#diagnostic"
            className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-spring transition-colors hover:text-cream"
          >
            {t.nav.cta}
            <span aria-hidden className="text-[0.8em]">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
