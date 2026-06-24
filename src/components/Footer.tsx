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
    { href: localePath(lang, "/guide-k-beauty"), label: t.footer.guide },
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

            <div className="mt-8">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-cream/25">
                {f.social}
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <span aria-label="Instagram" className="grid size-9 cursor-default place-items-center rounded-full border border-line-void text-cream/40 transition-colors hover:border-transparent hover:text-[#e25c8b]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </span>
                <span aria-label="TikTok" className="grid size-9 cursor-default place-items-center rounded-full border border-line-void text-cream/40 transition-colors hover:border-transparent hover:text-[#69c9d0]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" /><path d="M14 4.5c.4 2.3 2.2 3.9 4.5 4" /></svg>
                </span>
                <span aria-label="YouTube" className="grid size-9 cursor-default place-items-center rounded-full border border-line-void text-cream/40 transition-colors hover:border-transparent hover:text-[#ff4d4d]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10.5 9.2l4.5 2.8-4.5 2.8z" fill="currentColor" stroke="none" /></svg>
                </span>
                <span aria-label="Facebook" className="grid size-9 cursor-default place-items-center rounded-full border border-line-void text-cream/40 transition-colors hover:border-transparent hover:text-[#4a8cff]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.5c0-.78.22-1.3 1.33-1.3H16.3V5.78c-.25-.03-1.1-.1-2.07-.1-2.06 0-3.46 1.26-3.46 3.56v1.96H8.4V14h2.37v7z" /></svg>
                </span>
                <span aria-label="X" className="grid size-9 cursor-default place-items-center rounded-full border border-line-void text-cream/40 transition-colors hover:border-transparent hover:text-cream">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zM17.08 19.77h1.83L7.08 4.13H5.12z" /></svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-12 text-xs font-light leading-relaxed text-cream/22">
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
