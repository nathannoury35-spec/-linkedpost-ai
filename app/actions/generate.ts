"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getOpenAIClient } from "@/lib/openai/client"
import { SYSTEM_PROMPT, buildUserPrompt, type Tone, type Format } from "@/lib/openai/prompts"
import { type GenerateState, initialState } from "@/app/actions/generate.types"

export async function generatePost(
  _prevState: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { ...initialState, error: "Vous devez être connecté." }

  const jobTitle = (formData.get("job_title") as string)?.trim()
  const topic = (formData.get("topic") as string)?.trim()
  const tone = (formData.get("tone") as Tone) ?? "professional"
  const format = (formData.get("format") as Format) ?? "medium"

  if (!jobTitle || !topic) {
    return { ...initialState, error: "Veuillez remplir tous les champs." }
  }

  // ── Vérifier le profil et les crédits ──────────────────────
  let { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("generations_used, generations_limit")
    .eq("id", user.id)
    .single()

  if (profileError?.code === "PGRST116" || !profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email ?? "",
        full_name: user.user_metadata?.full_name ?? null,
        generations_used: 0,
        generations_limit: 3,
      })
      .select("generations_used, generations_limit")
      .single()

    profile = newProfile
  }

  if (!profile) {
    return { ...initialState, error: "Impossible de charger votre profil." }
  }

  if (profile.generations_used >= profile.generations_limit) {
    return {
      ...initialState,
      limitReached: true,
      error: null,
      creditsUsed: profile.generations_used,
      creditsLimit: profile.generations_limit,
    }
  }

  // ── Appel OpenAI ────────────────────────────────────────────
  let generatedPost: string

  try {
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt({ jobTitle, topic, tone, format }) },
      ],
      max_tokens: 900,
      temperature: 0.82,
    })

    generatedPost = completion.choices[0]?.message?.content?.trim() ?? ""

    if (!generatedPost) {
      return { ...initialState, error: "La génération a échoué. Réessayez." }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur OpenAI inconnue"
    return { ...initialState, error: `Erreur lors de la génération : ${msg}` }
  }

  // ── Incrémenter le compteur ──────────────────────────────────
  await supabase
    .from("profiles")
    .update({ generations_used: profile.generations_used + 1 })
    .eq("id", user.id)

  // ── Sauvegarde automatique en base ──────────────────────────
  const wordCount = generatedPost.trim().split(/\s+/).length
  const { data: savedPost } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content: generatedPost,
      tone,
      format,
      topic,
      job_title: jobTitle,
      word_count: wordCount,
      saved: false,
    })
    .select("id")
    .single()

  revalidatePath("/history")

  return {
    post: generatedPost,
    postId: savedPost?.id ?? null,
    error: null,
    limitReached: false,
    creditsUsed: profile.generations_used + 1,
    creditsLimit: profile.generations_limit,
    params: { jobTitle, topic, tone, format },
  }
}
