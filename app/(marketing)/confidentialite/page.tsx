export const metadata = {
  title: "Politique de confidentialité — LinkedPost AI",
}

export default function ConfidentialitePage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
        Politique de confidentialité
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">
        Dernière mise à jour : Mai 2026
      </p>

      <Section title="1. Présentation">
        <p>
          LinkedPost AI (ci-après « le Service ») est édité par Nathan Noury, dont les coordonnées sont disponibles à l'adresse <a href="mailto:contact@linkedpost-ai.com" className="text-blue-600 hover:underline">contact@linkedpost-ai.com</a>. La présente politique de confidentialité décrit la manière dont nous collectons, utilisons et protégeons vos données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
        </p>
      </Section>

      <Section title="2. Données collectées">
        <p>Lors de l'utilisation du Service, nous collectons les données suivantes :</p>
        <ul>
          <li><strong>Données d'identification :</strong> adresse email, nom complet (facultatif), fournis lors de l'inscription.</li>
          <li><strong>Données de profil :</strong> métier, secteur d'activité, cibles clients, style LinkedIn renseignés lors de l'onboarding.</li>
          <li><strong>Données d'utilisation :</strong> contenus générés (posts LinkedIn), historique de génération, nombre de posts créés.</li>
          <li><strong>Données de paiement :</strong> identifiant client Stripe et identifiant d'abonnement (les numéros de carte bancaire sont traités exclusivement par Stripe et ne transitent pas par nos serveurs).</li>
          <li><strong>Données techniques :</strong> adresse IP, navigateur, cookies de session nécessaires au fonctionnement du Service.</li>
        </ul>
      </Section>

      <Section title="3. Finalités du traitement">
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Créer et gérer votre compte utilisateur ;</li>
          <li>Générer des posts LinkedIn personnalisés grâce à l'IA (OpenAI) ;</li>
          <li>Gérer votre abonnement et les paiements (Stripe) ;</li>
          <li>Vous envoyer des rappels email (Resend) liés à vos posts planifiés ;</li>
          <li>Améliorer la qualité du Service et prévenir les abus ;</li>
          <li>Répondre à vos demandes de support.</li>
        </ul>
      </Section>

      <Section title="4. Base légale">
        <p>Le traitement de vos données repose sur :</p>
        <ul>
          <li><strong>L'exécution du contrat</strong> : fourniture du Service souscrit ;</li>
          <li><strong>Le consentement</strong> : pour les cookies non essentiels et les communications marketing ;</li>
          <li><strong>L'intérêt légitime</strong> : sécurité du Service, prévention des fraudes ;</li>
          <li><strong>L'obligation légale</strong> : conservation des données comptables et fiscales.</li>
        </ul>
      </Section>

      <Section title="5. Sous-traitants">
        <p>Le Service fait appel aux sous-traitants suivants, chacun soumis à des garanties contractuelles conformes au RGPD :</p>
        <ul>
          <li><strong>Supabase</strong> (hébergement base de données, authentification) — serveurs hébergés dans l'Union Européenne ;</li>
          <li><strong>OpenAI</strong> (génération de contenu IA) — les données envoyées sont limitées au sujet, ton et métier ; elles ne sont pas utilisées pour entraîner les modèles ;</li>
          <li><strong>Stripe</strong> (traitement des paiements) — certifié PCI-DSS niveau 1 ;</li>
          <li><strong>Resend</strong> (emails transactionnels) — serveurs aux États-Unis, couvert par les clauses contractuelles types de la Commission Européenne ;</li>
          <li><strong>Vercel</strong> (hébergement applicatif) — serveurs en Europe (région fra1).</li>
        </ul>
      </Section>

      <Section title="6. Durée de conservation">
        <p>Vos données sont conservées pendant <strong>3 ans</strong> à compter de la dernière activité sur votre compte. À l'expiration de ce délai, vos données sont supprimées ou anonymisées. Les données de facturation sont conservées 10 ans conformément aux obligations légales françaises.</p>
        <p>En cas de suppression de compte, vos données personnelles sont effacées dans un délai de 30 jours, à l'exception des données nécessaires à nos obligations légales.</p>
      </Section>

      <Section title="7. Vos droits RGPD">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> obtenir une copie des données vous concernant ;</li>
          <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes ;</li>
          <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données (« droit à l'oubli ») ;</li>
          <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible ;</li>
          <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données ;</li>
          <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données dans certaines circonstances.</li>
        </ul>
        <p>Pour exercer ces droits, contactez-nous à <a href="mailto:contact@linkedpost-ai.com" className="text-blue-600 hover:underline">contact@linkedpost-ai.com</a>. Nous répondrons dans un délai de 30 jours. Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a>).</p>
      </Section>

      <Section title="8. Cookies">
        <p>Le Service utilise des cookies strictement nécessaires à son fonctionnement (session d'authentification) et des cookies analytiques anonymisés pour mesurer l'audience. Vous pouvez accepter ou refuser les cookies non essentiels via le bandeau affiché lors de votre première visite.</p>
      </Section>

      <Section title="9. Sécurité">
        <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou altération : chiffrement des communications (HTTPS/TLS), hachage des mots de passe, contrôle d'accès par rôle.</p>
      </Section>

      <Section title="10. Modifications">
        <p>Nous nous réservons le droit de modifier cette politique à tout moment. En cas de modification substantielle, vous en serez informé par email. La date de dernière mise à jour est indiquée en haut de ce document.</p>
      </Section>

      <Section title="11. Contact">
        <p>
          Pour toute question relative à cette politique :<br />
          <strong>LinkedPost AI</strong> — <a href="mailto:contact@linkedpost-ai.com" className="text-blue-600 hover:underline">contact@linkedpost-ai.com</a>
        </p>
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
        {title}
      </h2>
      <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}
