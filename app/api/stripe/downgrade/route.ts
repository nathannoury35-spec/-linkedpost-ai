import { stripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_subscription_id, role")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_subscription_id) {
      return NextResponse.json({ error: "Aucun abonnement actif trouvé." }, { status: 400 })
    }

    const subscription = await stripe.subscriptions.update(
      profile.stripe_subscription_id,
      { cancel_at_period_end: true }
    )

    // Dans l'API Stripe 2026-04-22.dahlia, current_period_end est sur l'item
    const periodEnd = subscription.items.data[0]?.current_period_end
      ?? subscription.billing_cycle_anchor

    const endDate = new Date(periodEnd * 1000)
    const formatted = endDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    console.log(`[downgrade] user=${user.id} sub=${profile.stripe_subscription_id} ends=${formatted}`)

    return NextResponse.json({
      success: true,
      periodEnd,
      message: `Votre plan sera rétrogradé le ${formatted}. Vous conservez votre accès actuel jusqu'à cette date.`,
    })
  } catch (err) {
    console.error("[POST /api/stripe/downgrade] Error:", err)
    return NextResponse.json({ error: "Une erreur est survenue lors de la rétrogradation." }, { status: 500 })
  }
}
