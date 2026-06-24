import type { Lang } from "@/lib/locale";

export function ContactContent({ lang }: { lang: Lang }) {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  return (
    <article className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-6 sm:px-10">
        <p className="eyebrow text-spring-deep">{L("Contact", "Contact")}</p>
        <h1 className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
          {L("Parlons-en.", "Get in touch.")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-stone">
          {L(
            "Une question, un partenariat de marque, la presse ? Fiomio est une plateforme parisienne de recommandation de skincare K-beauty par IA. Écrivez-nous, nous répondons rapidement.",
            "A question, a brand partnership, press? Fiomio is a Paris-based AI Korean-skincare recommendation platform. Write to us, we reply quickly.",
          )}
        </p>
        <a
          href="mailto:hello@fiomio.io"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-spring-deep px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
        >
          hello@fiomio.io
        </a>
        <p className="mt-8 text-sm text-stone-2">
          {L("Pour les marques : ", "For brands: ")}
          <a className="link-underline text-spring-deep" href={lang === "fr" ? "/marques" : "/en/marques"}>
            {L("voir notre offre données", "see our data offer")}
          </a>.
        </p>
      </div>
    </article>
  );
}
