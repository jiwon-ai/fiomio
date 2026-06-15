import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Comment on gagne de l'argent",
  description:
    "En toute transparence : comment Fiomio se rémunère, et ce qu'on ne vend jamais.",
  alternates: { canonical: "https://fiomio.io/transparence" },
  robots: { index: true, follow: true },
};

export default function Transparence() {
  return (
    <LegalPage title="Comment on gagne de l'argent" updated="15 juin 2026">
      <p>
        Un service gratuit doit bien se financer quelque part. Plutôt que de le
        cacher, on l&apos;explique — parce que la confiance, ça se mérite.
      </p>

      <blockquote>
        Les marques peuvent acheter de la visibilité. Jamais notre avis, notre
        note, ni une place dans un classement.
      </blockquote>

      <h2>1. Liens d&apos;affiliation</h2>
      <p>
        Quand on recommande un produit, le lien peut être affilié : si vous
        l&apos;achetez, on touche une petite commission, <strong>sans surcoût
        pour vous</strong>. On ne met ce lien que sur un produit qu&apos;on aurait
        recommandé de toute façon. La commission ne change jamais notre avis, et
        elle est toujours signalée.
      </p>

      <h2>2. Rapports de marché (B2B)</h2>
      <p>
        À terme, on vendra aux marques des analyses agrégées et anonymes sur les
        comportements skincare en France. Les marques paient pour comprendre le
        marché — <strong>pas pour influencer ce qu&apos;on vous recommande</strong>.
        Vos données individuelles ne sont jamais vendues.
      </p>

      <h2>3. Publicité étiquetée</h2>
      <p>
        Un espace peut être sponsorisé (bannière, mise en avant) : dans ce cas,
        c&apos;est écrit <strong>« Sponsorisé »</strong>, noir sur blanc, et
        clairement séparé de nos tests indépendants. Vous saurez toujours ce qui
        est payé et ce qui ne l&apos;est pas.
      </p>

      <h2>Ce qu&apos;on ne vend jamais</h2>
      <ul>
        <li>une recommandation du diagnostic ;</li>
        <li>une note ou un avis dans un test ;</li>
        <li>une place dans un classement ou un « meilleur de » ;</li>
        <li>vos données personnelles.</li>
      </ul>

      <p>
        Une question ? Écrivez-nous : <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
      </p>
    </LegalPage>
  );
}
