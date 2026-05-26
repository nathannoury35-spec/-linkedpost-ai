export const APP_NAME = "LinkedPost AI"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const PLANS = {
  free: {
    name: "Gratuit",
    credits: 3,
    price: 0,
  },
  starter: {
    name: "Starter",
    credits: 30,
    price: 15,
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER?.trim(),
  },
  pro: {
    name: "Pro",
    credits: 100,
    price: 29,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO?.trim(),
  },
} as const

export const POST_TONES = [
  { value: "professional", label: "Professionnel" },
  { value: "casual", label: "Décontracté" },
  { value: "inspirational", label: "Inspirant" },
  { value: "educational", label: "Éducatif" },
  { value: "storytelling", label: "Storytelling" },
] as const
