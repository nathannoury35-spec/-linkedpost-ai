export type UserRole = "free" | "starter" | "pro"

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  credits_remaining: number
  created_at: string
}

export interface GeneratedPost {
  id: string
  user_id: string
  content: string
  tone: PostTone
  topic: string
  created_at: string
}

export type PostTone = "professional" | "casual" | "inspirational" | "educational" | "storytelling"

export interface SubscriptionPlan {
  id: string
  name: string
  price_monthly: number
  credits: number
  stripe_price_id: string
}
