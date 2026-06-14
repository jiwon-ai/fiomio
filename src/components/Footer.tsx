"use client";

import { useLang } from "@/lib/i18n";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";

export function Footer() {
  const { t } = useLang();
  const f = t.footer;
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/#probleme", label: t.nav.problem },
    { href: "/#solution", label: t.nav.solution },
    { href: "/#diagnostic", label: t.nav.diagnostic },
    { href: "/#marche", label: t.nav.market },
    { href: "/journal", label: t.nav.journal },
    { href: "/#rejoindre", label: t.nav.cta },
  ];

  return (
    <footer className="border-t border-line-dark bg-ink-2 pt-16 pb-8 text-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* brand */}
          <div>
            <div className="text-2xl">
              <Wordmark onDark />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">
              {f.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {f.pillars.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-cream/12 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-cream/55"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* nav */}
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-cream/35">
              {f.nav}
            </p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-cream/65 hover:text-cream"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* legal */}
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-cream/35">
              {f.legalCol}
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#" className="link-underline text-sm text-cream/65 hover:text-cream">
                  {f.legalNotice}
                </a>
              </li>
              <li>
                <a href="#" className="link-underline text-sm text-cream/65 hover:text-cream">
                  {f.privacy}
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@fiomio.io"
                  className="link-underline text-sm text-cream/65 hover:text-cream"
                >
                  {f.contact} — hello@fiomio.io
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <LangToggle onDark />
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-2xl text-xs leading-relaxed text-cream/35">
          {f.disclaimer}
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-line-dark pt-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} Fiomio. {f.rights}
          </span>
          <span>{f.madeIn}</span>
        </div>
      </div>
    </footer>
  );
}
