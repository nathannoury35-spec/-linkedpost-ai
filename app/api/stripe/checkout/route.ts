import { stripe } from "@/lib/stripe/client"
import { createClient } from "@/lib/supabase/server"
import { APP_URL } from "@/lib/constants"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: { priceId: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Corps invalide" }, { status: 400 })
  }

  const { priceId } = body
  if (!priceId) {
    return Response.json({ error: "priceId manquant" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${APP_URL}/pricing`,
      metadata: { userId: user.id, priceId },
    })

    return Response.json({ url: session.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur Stripe inconnue"
    return Response.json({ error: msg }, { status: 500 })
  }
}
