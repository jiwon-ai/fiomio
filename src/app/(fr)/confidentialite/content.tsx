import { LegalPage } from "@/components/LegalPage";
import type { Lang } from "@/lib/locale";

export function ConfidentialiteContent({ lang }: { lang: Lang }) {

  if (lang === "en") {
    return (
      <LegalPage lang={lang} title="Privacy policy" updated="June 15, 2026">
        <p>
          Fiomio attaches great importance to protecting your privacy. This policy
          explains what data we collect, why, and what your rights are, in accordance with
          the General Data Protection Regulation (GDPR) and the French Data Protection Act.
        </p>

        <h2>Data controller</h2>
        <p>
          The data controller is the publisher of the site (see
          <a href="/mentions-legales"> legal notice</a>), reachable at hello@fiomio.io.
        </p>

        <h2>Data collected</h2>
        <p>We only collect the data you provide voluntarily:</p>
        <ul>
          <li>
            <strong>Email address</strong>, when you join the waitlist or subscribe to the
            newsletter.
          </li>
          <li>
            <strong>Diagnostic answers</strong> (skin type, concerns, city), processed in
            your browser to generate the recommendation; they are not linked to your
            identity nor stored on our servers in the current version.
          </li>
        </ul>

        <h2>Purposes and legal basis</h2>
        <ul>
          <li>Sending you early access and the newsletter, legal basis: your <strong>consent</strong>.</li>
          <li>Improving the service and the content, legitimate interest, on aggregated and anonymous data.</li>
        </ul>

        <h2>Retention period</h2>
        <p>
          Your email address is kept until you unsubscribe, then deleted within a
          reasonable time. You can unsubscribe at any time via the link in every email.
        </p>

        <h2>Recipients</h2>
        <p>
          Your data is never sold. It may be processed by our technical subcontractors
          (hosting, email sending service), bound to protect it in accordance with the GDPR.
        </p>

        <h2>Your rights</h2>
        <p>You have the following rights over your data at any time:</p>
        <ul>
          <li>right of access, rectification and erasure;</li>
          <li>right to portability and to restriction of processing;</li>
          <li>right to object and to withdraw your consent.</li>
        </ul>
        <p>
          To exercise them, write to <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
          You may also lodge a complaint with the CNIL (cnil.fr).
        </p>

        <h2>Cookies</h2>
        <p>
          The site does not use advertising cookies or third-party trackers for profiling.
          Only elements strictly necessary for the site to function properly may be used. If
          audience-measurement tools were added in the future, your consent would be obtained
          beforehand.
        </p>

        <h2>Contact</h2>
        <p>
          For any question about your data: <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage lang={lang} title="Politique de confidentialité" updated="15 juin 2026">
      <p>
        Fiomio attache une grande importance à la protection de votre vie privée.
        Cette politique explique quelles données nous collectons, pourquoi, et
        quels sont vos droits, conformément au Règlement général sur la protection
        des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement est l&apos;éditeur du site (voir
        <a href="/mentions-legales"> mentions légales</a>), joignable à
        hello@fiomio.io.
      </p>

      <h2>Données collectées</h2>
      <p>Nous collectons uniquement les données que vous nous transmettez volontairement :</p>
      <ul>
        <li>
          <strong>Adresse e-mail</strong>, lorsque vous rejoignez la liste d&apos;attente
          ou vous abonnez à la newsletter.
        </li>
        <li>
          <strong>Réponses au diagnostic</strong> (type de peau, préoccupations,
          ville), traitées dans votre navigateur pour générer la recommandation ;
          elles ne sont pas associées à votre identité ni conservées sur nos
          serveurs dans la version actuelle.
        </li>
      </ul>

      <h2>Finalités et base légale</h2>
      <ul>
        <li>Vous envoyer l&apos;accès anticipé et la newsletter, base légale : votre <strong>consentement</strong>.</li>
        <li>Améliorer le service et le contenu, intérêt légitime, sur données agrégées et anonymes.</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Votre adresse e-mail est conservée jusqu&apos;à votre désinscription, puis
        supprimée dans un délai raisonnable. Vous pouvez vous désinscrire à tout
        moment via le lien présent dans chaque e-mail.
      </p>

      <h2>Destinataires</h2>
      <p>
        Vos données ne sont jamais vendues. Elles peuvent être traitées par nos
        sous-traitants techniques (hébergement, service d&apos;envoi d&apos;e-mails),
        engagés à les protéger conformément au RGPD.
      </p>

      <h2>Vos droits</h2>
      <p>Vous disposez à tout moment des droits suivants sur vos données :</p>
      <ul>
        <li>droit d&apos;accès, de rectification et d&apos;effacement ;</li>
        <li>droit à la portabilité et à la limitation du traitement ;</li>
        <li>droit d&apos;opposition et de retrait de votre consentement.</li>
      </ul>
      <p>
        Pour les exercer, écrivez à <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
        Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise pas de cookies publicitaires ni de traceurs tiers à
        des fins de profilage. Seuls des éléments strictement nécessaires au bon
        fonctionnement du site peuvent être utilisés. Si des outils de mesure
        d&apos;audience étaient ajoutés à l&apos;avenir, votre consentement serait
        recueilli au préalable.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question sur vos données : <a href="mailto:hello@fiomio.io">hello@fiomio.io</a>.
      </p>
    </LegalPage>
  );
}
