import type { Tone, Format } from "@/lib/openai/prompts"

export type GenerateState = {
  post: string | null
  postId: string | null
  error: string | null
  limitReached: boolean
  creditsUsed: number | null
  creditsLimit: number | null
  params: {
    jobTitle: string
    topic: string
    tone: Tone
    format: Format
  } | null
}

export const initialState: GenerateState = {
  post: null,
  postId: null,
  error: null,
  limitReached: false,
  creditsUsed: null,
  creditsLimit: null,
  params: null,
}
