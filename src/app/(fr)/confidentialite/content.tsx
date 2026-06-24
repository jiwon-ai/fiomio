import { LegalPage } from "@/components/LegalPage";
import { localePath, type Lang } from "@/lib/locale";

export function ConfidentialiteContent({ lang }: { lang: Lang }) {
  if (lang === "en") {
    return (
      <LegalPage lang={lang} title="Privacy policy" updated="June 23, 2026">
        <p>
          Fiomio attaches great importance to protecting your privacy. This policy
          explains what data we collect, why, and what your rights are, in accordance with
          the General Data Protection Regulation (GDPR) and the French Data Protection Act.
        </p>

        <h2>Data controller</h2>
        <p>
          The data controller is the publisher of the site (see
          <a href={localePath(lang, "/mentions-legales")}> legal notice</a>), reachable at hello@fiomio.io.
        </p>

        <h2>Data we collect</h2>
        <ul>
          <li><strong>Email address</strong>, when you join the waitlist or subscribe to the newsletter.</li>
          <li><strong>City and approximate location</strong>, auto-detected from your IP and editable, or chosen by you, so we can tailor the newsletter to your local climate and season. Stored alongside your email only if you subscribe.</li>
          <li><strong>Anonymous diagnostic data</strong>, your answers (skin type, concerns, chosen actives, city, season) and the actives we recommend are stored in <strong>anonymized</strong> form, <strong>without your email and without your IP address</strong>, to improve the quality of our recommendation engine.</li>
          <li><strong>Anonymous feedback</strong>, whether a recommendation felt right, stored without any identifier.</li>
          <li><strong>Cookieless audience measurement</strong>, aggregate visit statistics that use no cookies and do not identify you.</li>
        </ul>

        <h2>Purposes and legal basis</h2>
        <ul>
          <li>Sending you early access and the seasonal newsletter, legal basis: your <strong>consent</strong> (given when you sign up).</li>
          <li>Improving our recommendation engine from anonymized diagnostic and feedback data, <strong>legitimate interest</strong>.</li>
          <li>Producing <strong>aggregated, anonymized</strong> market insights and reports that may be shared or sold to skincare brands, legitimate interest. These contain <strong>no individual data</strong> and never identify you.</li>
        </ul>

        <h2>Recipients and processors</h2>
        <p>Your personal data is never sold. The only recipient of personal data is our email provider (Brevo, based in the EU), used to manage the waitlist and the newsletter. Our other providers receive no data that identifies you: hosting and cookieless analytics receive no identifying data, weather lookup receives none, and diagnostic data is anonymized. A full list of our processors is available on request.</p>
        <p>Brands only ever receive <strong>aggregated, anonymized</strong> insights, never your personal data.</p>

        <h2>Retention period</h2>
        <p>
          Your email and city are kept until you unsubscribe, then deleted within a
          reasonable time. Anonymized diagnostic data, being non-identifying, may be kept to
          improve the service. You can unsubscribe at any time via the link in every email.
        </p>

        <h2>Your rights</h2>
        <p>You have the following rights over your personal data at any time:</p>
        <ul>
          <li>right of access, rectification and erasure;</li>
          <li>right to portability and to restriction of processing;</li>
          <li>right to object and to withdraw your consent.</li>
        </ul>
        <p>
          To exercise them, write to <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
          You may also lodge a complaint with the CNIL (cnil.fr). Note that anonymized data
          cannot be linked back to you and therefore cannot be individually retrieved.
        </p>

        <h2>Cookies</h2>
        <p>
          The site uses no advertising cookies and no third-party profiling trackers. Our
          audience measurement is cookieless. Only elements strictly necessary for the site
          to function may be used.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about your data: <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang={lang} title="Politique de confidentialité" updated="23 juin 2026">
      <p>
        Fiomio attache une grande importance à la protection de votre vie privée.
        Cette politique explique quelles données nous collectons, pourquoi, et
        quels sont vos droits, conformément au Règlement général sur la protection
        des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement est l&apos;éditeur du site (voir
        <a href={localePath(lang, "/mentions-legales")}> mentions légales</a>), joignable à
        hello@fiomio.io.
      </p>

      <h2>Données que nous collectons</h2>
      <ul>
        <li><strong>Adresse e-mail</strong>, lorsque vous rejoignez la liste d&apos;attente ou vous abonnez à la newsletter.</li>
        <li><strong>Ville et localisation approximative</strong>, détectée automatiquement à partir de votre IP et modifiable, ou choisie par vous, afin d&apos;adapter la newsletter au climat et à la saison de votre ville. Conservée avec votre e-mail uniquement si vous vous inscrivez.</li>
        <li><strong>Données de diagnostic anonymes</strong>, vos réponses (type de peau, préoccupations, actifs utilisés, ville, saison) et les actifs recommandés sont conservés de façon <strong>anonymisée</strong>, <strong>sans votre e-mail et sans votre adresse IP</strong>, pour améliorer la qualité de notre moteur de recommandation.</li>
        <li><strong>Retours anonymes</strong>, si une recommandation vous a semblé juste, enregistré sans aucun identifiant.</li>
        <li><strong>Mesure d&apos;audience sans cookie</strong>, des statistiques de visite agrégées, sans cookie et qui ne vous identifient pas.</li>
      </ul>

      <h2>Finalités et base légale</h2>
      <ul>
        <li>Vous envoyer l&apos;accès anticipé et la newsletter saisonnière, base légale : votre <strong>consentement</strong> (donné lors de l&apos;inscription).</li>
        <li>Améliorer notre moteur de recommandation à partir de données de diagnostic et de retours anonymisés, <strong>intérêt légitime</strong>.</li>
        <li>Produire des analyses et rapports de marché <strong>agrégés et anonymisés</strong>, susceptibles d&apos;être partagés ou vendus à des marques de soin, intérêt légitime. Ils ne contiennent <strong>aucune donnée individuelle</strong> et ne vous identifient jamais.</li>
      </ul>

      <h2>Destinataires et sous-traitants</h2>
      <p>Vos données personnelles ne sont jamais vendues. Le seul destinataire de données personnelles est notre prestataire e-mail (Brevo, situé dans l&apos;UE), pour gérer la liste d&apos;attente et la newsletter. Nos autres prestataires ne reçoivent aucune donnée permettant de vous identifier : l&apos;hébergement et la mesure d&apos;audience sans cookie n&apos;en reçoivent aucune, la recherche météo non plus, et les données de diagnostic sont anonymisées. La liste complète de nos prestataires est disponible sur demande.</p>
      <p>Les marques ne reçoivent que des analyses <strong>agrégées et anonymisées</strong>, jamais vos données personnelles.</p>

      <h2>Durée de conservation</h2>
      <p>
        Votre e-mail et votre ville sont conservés jusqu&apos;à votre désinscription, puis
        supprimés dans un délai raisonnable. Les données de diagnostic anonymisées, n&apos;étant
        pas identifiantes, peuvent être conservées pour améliorer le service. Vous pouvez
        vous désinscrire à tout moment via le lien présent dans chaque e-mail.
      </p>

      <h2>Vos droits</h2>
      <p>Vous disposez à tout moment des droits suivants sur vos données personnelles :</p>
      <ul>
        <li>droit d&apos;accès, de rectification et d&apos;effacement ;</li>
        <li>droit à la portabilité et à la limitation du traitement ;</li>
        <li>droit d&apos;opposition et de retrait de votre consentement.</li>
      </ul>
      <p>
        Pour les exercer, écrivez à <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
        Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).
        Les données anonymisées ne pouvant être reliées à vous, elles ne peuvent pas être
        retrouvées individuellement.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise pas de cookies publicitaires ni de traceurs tiers de
        profilage. Notre mesure d&apos;audience est sans cookie. Seuls des éléments
        strictement nécessaires au bon fonctionnement du site peuvent être utilisés.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question sur vos données : <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
      </p>
    </LegalPage>
  );
}
