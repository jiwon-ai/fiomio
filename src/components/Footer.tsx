import type { Lang, Messages } from "@/lib/locale";
import { localePath } from "@/lib/locale";
import { Wordmark } from "./Wordmark";
import { LangToggle } from "./LangToggle";

export function Footer({ lang, t }: { lang: Lang; t: Messages }) {
  const f = t.footer;
  const year = new Date().getFullYear();
  const home = localePath(lang, "/");

  const navLinks = [
    { href: `${home === "/" ? "" : home}/#probleme`, label: t.nav.problem },
    { href: `${home === "/" ? "" : home}/#solution`, label: t.nav.solution },
    { href: `${home === "/" ? "" : home}/#diagnostic`, label: t.nav.diagnostic },
    { href: localePath(lang, "/journal"), label: t.nav.journal },
    { href: localePath(lang, "/marques"), label: t.nav.brands },
    { href: localePath(lang, "/a-propos"), label: t.footer.about },
    { href: `${home === "/" ? "" : home}/#rejoindre`, label: t.nav.cta },
  ];

  return (
    <footer className="border-t border-line-void bg-void-2 pb-8 pt-16 text-cream">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* brand */}
          <div>
            <div className="text-xl">
              <Wordmark onDark />
            </div>
            <p className="mt-5 max-w-xs text-sm font-light leading-relaxed text-cream/35">
              {f.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {f.pillars.map((p) => (
                <span
                  key={p}
                  className="border border-line-void px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-cream/30"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* nav */}
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cream/25">
              {f.nav}
            </p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="link-underline text-sm font-light text-cream/40 hover:text-cream/75"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* legal */}
          <div>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cream/25">
              {f.legalCol}
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={localePath(lang, "/mentions-legales")}
                  className="link-underline text-sm font-light text-cream/40 hover:text-cream/75"
                >
                  {f.legalNotice}
                </a>
              </li>
              <li>
                <a
                  href={localePath(lang, "/confidentialite")}
                  className="link-underline text-sm font-light text-cream/40 hover:text-cream/75"
                >
                  {f.privacy}
                </a>
              </li>
              <li>
                <a
                  href={localePath(lang, "/contact")}
                  className="link-underline text-sm font-light text-cream/40 hover:text-cream/75"
                >
                  {f.contact} : hello@fiomio.io
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <LangToggle lang={lang} onDark />
            </div>
          </div>
        </div>

        <p className="mt-12 max-w-2xl text-xs font-light leading-relaxed text-cream/22">
          {f.disclaimer}
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-line-void pt-6 text-[0.7rem] text-cream/25 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} Fiomio. {f.rights}
          </span>
          <span>{f.madeIn}</span>
        </div>
      </div>
    </footer>
  );
}
