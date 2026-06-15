import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Fiomio.",
  alternates: { canonical: "https://fiomio.io/mentions-legales" },
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="15 juin 2026">
      <p>
        Conformément à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004 pour la
        confiance dans l&apos;économie numérique (LCEN), les présentes mentions légales
        sont portées à la connaissance des utilisateurs du site <strong>fiomio.io</strong>.
      </p>

      <h2>Éditeur du site</h2>
      <ul>
        <li>Raison sociale : <strong>[à compléter — nom / dénomination]</strong></li>
        <li>Forme juridique : [à compléter — ex. micro-entreprise, SAS, SASU]</li>
        <li>Adresse : [à compléter — siège social]</li>
        <li>SIRET : [à compléter]</li>
        <li>Adresse e-mail : hello@fiomio.io</li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>Jiwon Yi — joignable à l&apos;adresse hello@fiomio.io.</p>

      <h2>Hébergeur</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133,
        Walnut, CA 91789, États-Unis — vercel.com.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur le site (textes, visuels, logo,
        charte graphique, base de données d&apos;ingrédients) est la propriété
        exclusive de l&apos;éditeur, sauf mention contraire. Toute reproduction,
        représentation ou diffusion, totale ou partielle, sans autorisation écrite
        préalable est interdite et constituerait une contrefaçon.
      </p>

      <h2>Liens d&apos;affiliation</h2>
      <p>
        Certains liens présents sur le site (notamment dans les tests produits)
        sont des liens d&apos;affiliation : un achat effectué via ces liens peut
        donner lieu à une commission, sans surcoût pour vous. Cela n&apos;influence
        pas l&apos;honnêteté de nos avis.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les informations skincare proposées sur Fiomio sont fournies à titre
        éducatif et ne constituent pas un avis médical ou dermatologique. Elles ne
        remplacent pas la consultation d&apos;un professionnel de santé. L&apos;éditeur
        ne saurait être tenu responsable d&apos;une réaction cutanée ou d&apos;un
        dommage résultant de l&apos;usage des recommandations.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative au site : <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
      </p>
    </LegalPage>
  );
}
