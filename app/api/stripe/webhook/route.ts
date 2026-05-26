import { stripe } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/admin"
import type Stripe from "stripe"

const STARTER_PRICE_ID = process.env.STRIPE_PRICE_ID_STARTER?.trim()
const PRO_PRICE_ID = process.env.STRIPE_PRICE_ID_PRO?.trim()

function getPlanFromPriceId(priceId: string): { role: "starter" | "pro"; limit: number } | null {
  if (priceId === STARTER_PRICE_ID) return { role: "starter", limit: 30 }
  if (priceId === PRO_PRICE_ID) return { role: "pro", limit: 100 }
  return null
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature") ?? ""
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

  let event: Stripe.Event

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      event = JSON.parse(body) as Stripe.Event
    }
  } catch {
    return Response.json({ error: "Signature webhook invalide" }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const priceId = session.metadata?.priceId

      if (!userId || !priceId) {
        return Response.json({ error: "Métadonnées manquantes" }, { status: 400 })
      }

      const plan = getPlanFromPriceId(priceId)
      if (!plan) {
        return Response.json({ error: "Plan inconnu : " + priceId }, { status: 400 })
      }

      await supabase
        .from("profiles")
        .update({
          role: plan.role,
          generations_limit: plan.limit,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq("id", userId)

    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from("profiles")
        .update({
          role: "free",
          generations_limit: 3,
          stripe_subscription_id: null,
        })
        .eq("stripe_customer_id", customerId)
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne webhook"
    return Response.json({ error: msg }, { status: 500 })
  }

  return Response.json({ received: true })
}
