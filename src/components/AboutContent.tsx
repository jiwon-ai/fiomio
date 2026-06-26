import Link from "next/link";
import type { Lang } from "@/lib/locale";
import { localePath } from "@/lib/locale";

export function AboutContent({ lang }: { lang: Lang }) {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const home = localePath(lang, "/");
  const intro = L(
    "Fiomio est une plateforme parisienne de recommandation de skincare K-beauty par IA. Elle aide les utilisateurs européens à découvrir les produits coréens adaptés à leur type de peau, leur mode de vie, le climat de leur ville et leurs besoins. Fiomio relie l'expertise K-beauty à une personnalisation guidée par la donnée.",
    "Fiomio is a Paris-based AI skincare platform that helps European users discover Korean beauty products adapted to their skin type, lifestyle, the weather of their city, and personal needs. Fiomio connects K-beauty expertise with data-driven personalisation.",
  );
  const ld = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: L("À propos de Fiomio", "About Fiomio"),
    description: intro,
    url: `https://fiomio.io${lang === "fr" ? "" : "/en"}/a-propos`,
  };
  return (
    <article className="bg-cream py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-2xl px-6 sm:px-10">
        <p className="eyebrow text-spring-deep">{L("À propos", "About")}</p>
        <h1 className="font-display mt-3 font-semibold leading-tight tracking-tight text-ink" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
          {L("La K-beauty, décodée pour l'Europe.", "K-beauty, decoded for Europe.")}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-stone">{intro}</p>

        <section className="article-prose mt-10">
          <h2>{L("Notre mission", "Our mission")}</h2>
          <p>
            {L(
              "Les routines coréennes sont pensées pour le climat de Séoul. À Paris ou ailleurs en Europe, l'eau, le chauffage, l'air sec et les saisons changent tout. Fiomio croise votre peau, le climat local et les actifs K-beauty pour une recommandation personnalisée et expliquée — pas une liste de best-sellers.",
              "Korean routines are designed for Seoul's climate. In Paris or elsewhere in Europe, the water, indoor heating, dry air and seasons change everything. Fiomio crosses your skin, the local climate and K-beauty actives for a personalised, explained recommendation — not a list of best-sellers.",
            )}
          </p>
          <h2>{L("Comment ça marche", "How it works")}</h2>
          <p>
            {L(
              "Un diagnostic gratuit croise votre profil cutané, le climat de votre ville et une base d'actifs K-beauty décodés pour proposer des ingrédients argumentés, avec le pourquoi de chacun.",
              "A free diagnostic crosses your skin profile, your city's climate and a decoded K-beauty active database to suggest argued ingredients, with the reason for each.",
            )}
          </p>
          <h2>{L("Le mot de la fondatrice", "A word from the founder")}</h2>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/founder.jpg"
              alt={L("Portrait de la fondatrice de Fiomio", "Portrait of Fiomio's founder")}
              width={128}
              height={128}
              loading="lazy"
              className="!my-0 h-24 w-24 shrink-0 rounded-lg object-cover sm:h-28 sm:w-28"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, #000 2%, #000 98%, transparent), linear-gradient(to bottom, transparent, #000 2%, #000 98%, transparent)",
                WebkitMaskComposite: "source-in",
                maskImage:
                  "linear-gradient(to right, transparent, #000 2%, #000 98%, transparent), linear-gradient(to bottom, transparent, #000 2%, #000 98%, transparent)",
                maskComposite: "intersect",
              }}
            />
            <p className="!mt-0">
              {L(
                "Analyste de données et passionnée de cosmétique, la fondatrice a appliqué son métier à ce qu'elle aime : croiser la peau, la ville et la saison pour comprendre ce qui marche vraiment. Fiomio est né entre Paris et Séoul.",
                "A data analyst and cosmetics lover, the founder applied her craft to what she loves: crossing skin, city and season to understand what truly works. Fiomio was born between Paris and Seoul.",
              )}
            </p>
          </div>
          <h2>{L("Nos principes", "Our principles")}</h2>
          <p>
            {L(
              "Recommandations expliquées et vérifiables, jamais sponsorisées. Liens d'affiliation toujours signalés. Données conformes au RGPD, jamais revendues.",
              "Explained, verifiable recommendations, never sponsored. Affiliate links always disclosed. GDPR-compliant data, never resold.",
            )}
          </p>
        </section>

        <Link
          href={`${home}#diagnostic`}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-spring-deep px-6 py-3.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5"
        >
          {L("Faire mon diagnostic", "Take the diagnostic")} <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
