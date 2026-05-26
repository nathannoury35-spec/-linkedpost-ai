export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "free" | "starter" | "pro"
          generations_used: number
          generations_limit: number
          onboarding_completed: boolean
          metier: string | null
          secteur: string | null
          clients_cibles: string | null
          style_linkedin: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "free" | "starter" | "pro"
          generations_used?: number
          generations_limit?: number
          onboarding_completed?: boolean
          metier?: string | null
          secteur?: string | null
          clients_cibles?: string | null
          style_linkedin?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "free" | "starter" | "pro"
          generations_used?: number
          generations_limit?: number
          onboarding_completed?: boolean
          metier?: string | null
          secteur?: string | null
          clients_cibles?: string | null
          style_linkedin?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          tone: string
          format: string
          topic: string
          job_title: string
          word_count: number | null
          saved: boolean
          created_at: string
        }
        Insert: {
          user_id: string
          content: string
          tone: string
          format: string
          topic: string
          job_title: string
          word_count?: number | null
          saved?: boolean
        }
        Update: {
          user_id?: string
          content?: string
          tone?: string
          format?: string
          topic?: string
          job_title?: string
          word_count?: number | null
          saved?: boolean
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          id: string
          user_id: string
          content: string
          scheduled_date: string
          scheduled_time: string
          email_reminder: boolean
          status: string
          created_at: string
        }
        Insert: {
          user_id: string
          content: string
          scheduled_date: string
          scheduled_time?: string
          email_reminder?: boolean
          status?: string
        }
        Update: {
          content?: string
          scheduled_date?: string
          scheduled_time?: string
          email_reminder?: boolean
          status?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
