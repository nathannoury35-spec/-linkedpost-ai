import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlanCheckoutButton } from "@/components/PlanCheckoutButton"

const STARTER_PRICE_ID = process.env.STRIPE_PRICE_ID_STARTER?.trim() ?? ""
const PRO_PRICE_ID = process.env.STRIPE_PRICE_ID_PRO?.trim() ?? ""

const PLANS = [
  {
    id: "free" as const,
    name: "Gratuit",
    price: 0,
    period: "",
    description: "Pour découvrir l'outil",
    features: [
      "3 posts / mois",
      "Watermark LinkedPost AI",
      "2 tons disponibles (Professionnel, Décontracté)",
    ],
    cta: "Plan actuel",
    highlight: false,
    priceId: null,
  },
  {
    id: "starter" as const,
    name: "Starter",
    price: 15,
    period: "/ mois",
    description: "Pour les freelances actifs",
    features: [
      "30 posts / mois",
      "Tous les tons",
      "Historique complet",
      "Sauvegarde des favoris",
    ],
    cta: "Passer au Starter",
    highlight: true,
    badge: "Plus populaire",
    priceId: STARTER_PRICE_ID,
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 29,
    period: "/ mois",
    description: "Pour les créateurs sérieux",
    features: [
      "100 posts / mois",
      "Hooks premium",
      "Optimisation virale",
      "Calendrier de contenu (bientôt)",
    ],
    cta: "Passer au Pro",
    highlight: false,
    priceId: PRO_PRICE_ID,
  },
]

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, generations_used, generations_limit")
    .eq("id", user.id)
    .single()

  const role = profile?.role ?? "free"
  const used = profile?.generations_used ?? 0
  const limit = profile?.generations_limit ?? 3
  const remaining = Math.max(0, limit - used)
  const pct = Math.min(Math.round((used / limit) * 100), 100)
  const currentPlan = PLANS.find(p => p.id === role) ?? PLANS[0]

  const barColor =
    remaining === 0 ? "bg-red-500" :
    remaining <= 1 ? "bg-amber-500" :
    "bg-gradient-to-r from-blue-500 to-violet-500"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Abonnement & Facturation</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gérez votre plan et suivez votre consommation.</p>
      </div>

      {/* Usage actuel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Consommation ce mois</h2>
          <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/60 dark:to-violet-950/60 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 capitalize">
            Plan {currentPlan.name}
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          {remaining > 0
            ? `Il vous reste ${remaining} génération${remaining > 1 ? "s" : ""} ce mois.`
            : "Vous avez atteint la limite de votre plan."}
        </p>

        <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          <span>{used} utilisée{used > 1 ? "s" : ""}</span>
          <span>{limit} au total</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {remaining === 0 && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Limite atteinte. Passez au Starter ou Pro pour continuer.
          </div>
        )}
      </div>

      {/* Plans */}
      <div>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-4">Changer de plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === role

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all ${
                  plan.highlight && !isCurrent
                    ? "bg-gradient-to-br from-blue-600 to-violet-700 text-white shadow-xl shadow-blue-500/25"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {"badge" in plan && plan.badge && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-green-500 text-white text-xs font-bold whitespace-nowrap">
                    Votre plan actuel
                  </span>
                )}

                <div className="mb-4">
                  <h3 className={`font-bold text-lg ${plan.highlight && !isCurrent ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlight && !isCurrent ? "text-blue-200" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-4xl font-black ${plan.highlight && !isCurrent ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                    {plan.price}€
                  </span>
                  {plan.period && (
                    <span className={`text-sm ml-1 ${plan.highlight && !isCurrent ? "text-blue-200" : "text-slate-400 dark:text-slate-500"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight && !isCurrent ? "text-blue-200" : "text-blue-500 dark:text-blue-400"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.highlight && !isCurrent ? "text-blue-100" : "text-slate-600 dark:text-slate-300"}>{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className={`text-center py-2.5 rounded-xl text-sm font-semibold border ${
                    plan.highlight ? "border-white/30 text-white/70" : "border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500"
                  }`}>
                    Plan actuel
                  </div>
                ) : plan.priceId ? (
                  <PlanCheckoutButton
                    priceId={plan.priceId}
                    label={plan.cta}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                      plan.highlight
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
                    }`}
                  />
                ) : (
                  <div className={`text-center py-2.5 rounded-xl text-sm font-semibold border text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600`}>
                    {plan.cta}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Note sécurité */}
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm mb-1">Paiements sécurisés via Stripe</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Vos données bancaires ne sont jamais stockées sur nos serveurs. Stripe gère l&apos;ensemble du processus de paiement de manière sécurisée. Résiliation possible à tout moment depuis votre espace client.
          </p>
        </div>
      </div>
    </div>
  )
}
