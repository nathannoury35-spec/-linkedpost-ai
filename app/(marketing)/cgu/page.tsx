export const metadata = {
  title: "Conditions Générales d'Utilisation — LinkedPost AI",
}

export default function CguPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
        Conditions Générales d&apos;Utilisation
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-10">
        Dernière mise à jour : Mai 2026
      </p>

      <Section title="1. Objet">
        <p>
          Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du service LinkedPost AI (ci-après « le Service »), accessible à l'adresse <strong>lp-ai-prod.vercel.app</strong>, édité par Nathan Noury. En s'inscrivant au Service, l'utilisateur accepte sans réserve les présentes CGU.
        </p>
      </Section>

      <Section title="2. Description du Service">
        <p>
          LinkedPost AI est un service en ligne de génération de contenu LinkedIn assistée par intelligence artificielle, destiné aux professionnels indépendants, freelances et créateurs de contenu. Le Service permet notamment de :
        </p>
        <ul>
          <li>Générer des posts LinkedIn personnalisés grâce à l'IA ;</li>
          <li>Accéder à une bibliothèque de hooks viraux ;</li>
          <li>Planifier des publications via un calendrier de contenu ;</li>
          <li>Consulter l'historique des contenus générés.</li>
        </ul>
      </Section>

      <Section title="3. Plans tarifaires">
        <p>Le Service est proposé selon trois formules :</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="text-left p-3 font-semibold rounded-tl-lg">Plan</th>
                <th className="text-left p-3 font-semibold">Prix</th>
                <th className="text-left p-3 font-semibold rounded-tr-lg">Inclus</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium">Gratuit</td>
                <td className="p-3">0 €/mois</td>
                <td className="p-3">3 posts/mois, 2 tons</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium">Starter</td>
                <td className="p-3">15 €/mois</td>
                <td className="p-3">30 posts/mois, tous les tons, historique</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium">Pro</td>
                <td className="p-3">29 €/mois</td>
                <td className="p-3">100 posts/mois, calendrier, hooks premium</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Les prix s'entendent toutes taxes comprises. Le paiement est mensuel, prélevé automatiquement via Stripe. L'abonnement est renouvelé tacitement chaque mois jusqu'à résiliation.
        </p>
      </Section>

      <Section title="4. Inscription et compte">
        <p>
          L'accès au Service nécessite la création d'un compte avec une adresse email valide. L'utilisateur est responsable de la confidentialité de ses identifiants et de toute activité réalisée depuis son compte. Toute utilisation frauduleuse doit être signalée immédiatement à <a href="mailto:contact@linkedpost-ai.com" className="text-blue-600 hover:underline">contact@linkedpost-ai.com</a>.
        </p>
      </Section>

      <Section title="5. Obligations de l'utilisateur">
        <p>L'utilisateur s'engage à :</p>
        <ul>
          <li>Fournir des informations exactes lors de l'inscription ;</li>
          <li>Ne pas utiliser le Service à des fins illicites, frauduleuses ou contraires aux bonnes mœurs ;</li>
          <li>Ne pas tenter de contourner les limitations du Service (notamment les quotas de génération) ;</li>
          <li>Ne pas diffuser de contenus générés qui violeraient des droits tiers, seraient diffamatoires, discriminatoires ou inciteraient à la haine ;</li>
          <li>Respecter les conditions d'utilisation de LinkedIn lors de la publication des contenus générés.</li>
        </ul>
      </Section>

      <Section title="6. Propriété intellectuelle">
        <p>
          L'utilisateur conserve la pleine propriété des contenus qu'il génère via le Service. LinkedPost AI ne revendique aucun droit sur les posts produits. En revanche, la plateforme, son interface, ses algorithmes, ses bases de données et l'ensemble de ses éléments constitutifs sont la propriété exclusive de l'éditeur et sont protégés par le droit d'auteur. Toute reproduction ou exploitation non autorisée est interdite.
        </p>
      </Section>

      <Section title="7. Disponibilité et maintenance">
        <p>
          L'éditeur s'efforce d'assurer la disponibilité du Service 24h/24 et 7j/7 mais ne peut garantir une disponibilité sans interruption. Des opérations de maintenance peuvent entraîner des interruptions temporaires. En cas d'interruption prolongée, l'utilisateur peut contacter le support.
        </p>
      </Section>

      <Section title="8. Limitation de responsabilité">
        <p>
          Le Service fournit des contenus générés par intelligence artificielle à titre d'assistance à la création. L'éditeur ne garantit pas la pertinence, l'originalité ou les performances des contenus produits. L'utilisateur est seul responsable de l'utilisation et de la publication des contenus générés. La responsabilité de l'éditeur ne saurait être engagée pour tout dommage indirect résultant de l'utilisation du Service.
        </p>
      </Section>

      <Section title="9. Résiliation">
        <p>
          L'utilisateur peut résilier son abonnement à tout moment depuis son espace « Abonnement ». La résiliation prend effet à la fin de la période de facturation en cours. En cas de manquement grave aux présentes CGU, l'éditeur se réserve le droit de suspendre ou de résilier un compte sans préavis.
        </p>
      </Section>

      <Section title="10. Modification des CGU">
        <p>
          L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email avec un préavis de 15 jours. L'utilisation du Service après notification vaut acceptation des nouvelles CGU.
        </p>
      </Section>

      <Section title="11. Droit applicable et litiges">
        <p>
          Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux compétents de Paris seront seuls compétents.
        </p>
        <p>
          Conformément à l'article L. 612-1 du Code de la consommation, tout consommateur peut recourir gratuitement au service de médiation MÉDIATEUR DE LA CONSOMMATION en cas de litige non résolu.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Pour toute question relative aux présentes CGU :<br />
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
