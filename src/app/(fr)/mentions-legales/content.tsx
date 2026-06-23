import { LegalPage } from "@/components/LegalPage";
import type { Lang } from "@/lib/locale";

export function MentionsContent({ lang }: { lang: Lang }) {

  if (lang === "en") {
    return (
      <LegalPage lang={lang} title="Legal notice" updated="June 15, 2026">
        <p>
          In accordance with article 6 of French law no. 2004-575 of 21 June 2004 on
          confidence in the digital economy (LCEN), this legal notice is made available
          to users of the site <strong>fiomio.io</strong>.
        </p>

        <h2>Site publisher</h2>
        <p>
          The site fiomio.io is published on an individual basis by <strong>Jiwon Yi</strong>,
          as part of a project under development.
        </p>
        <ul>
          <li>Contact: <a href="mailto:hello@fiomio.io">hello@fiomio.io</a></li>
        </ul>
        <p>
          Fiomio does not yet carry on a registered commercial activity. Upon
          registration (micro-enterprise or company), the corresponding legal
          information (business name, legal form, registered address and SIRET number)
          will be added to this page.
        </p>

        <h2>Publication director</h2>
        <p>Jiwon Yi, reachable at hello@fiomio.io.</p>

        <h2>Host</h2>
        <p>
          The site is hosted by <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133,
          Walnut, CA 91789, United States, vercel.com.
        </p>

        <h2>Intellectual property</h2>
        <p>
          All content on the site (text, visuals, logo, graphic identity, ingredient
          database) is the exclusive property of the publisher, unless otherwise stated.
          Any reproduction, representation or distribution, in whole or in part, without
          prior written authorization is prohibited and would constitute infringement.
        </p>

        <h2>Affiliate links</h2>
        <p>
          Some links on the site (notably in product reviews) are affiliate links: a
          purchase made through them may earn a commission, at no extra cost to you. This
          never affects the honesty of our reviews.
        </p>

        <h2>Liability</h2>
        <p>
          The skincare information provided on Fiomio is for educational purposes and does
          not constitute medical or dermatological advice. It does not replace consulting a
          healthcare professional. The publisher cannot be held liable for any skin reaction
          or damage resulting from the use of the recommendations.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about the site: <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang={lang} title="Mentions légales" updated="15 juin 2026">
      <p>
        Conformément à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004 pour la
        confiance dans l&apos;économie numérique (LCEN), les présentes mentions légales
        sont portées à la connaissance des utilisateurs du site <strong>fiomio.io</strong>.
      </p>

      <h2>Éditeur du site</h2>
      <p>
        Le site fiomio.io est édité à titre individuel par <strong>Jiwon Yi</strong>,
        dans le cadre d&apos;un projet en cours de développement.
      </p>
      <ul>
        <li>Contact : <a href="mailto:hello@fiomio.io">hello@fiomio.io</a></li>
      </ul>
      <p>
        Fiomio n&apos;exerce pas encore d&apos;activité commerciale immatriculée.
        Dès l&apos;immatriculation (micro-entreprise ou société), les informations
        légales correspondantes (dénomination, forme juridique, adresse du siège
        social et numéro SIRET) seront ajoutées sur cette page.
      </p>

      <h2>Directeur de la publication</h2>
      <p>Jiwon Yi, joignable à l&apos;adresse hello@fiomio.io.</p>

      <h2>Hébergeur</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133,
        Walnut, CA 91789, États-Unis, vercel.com.
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
