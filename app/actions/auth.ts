"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export type AuthState = { error: string | null; success?: string }

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = (formData.get("email") as string | null)?.trim()
    const password = formData.get("password") as string | null
    const fullName = (formData.get("full_name") as string | null)?.trim()

    if (!fullName || !email || !password) {
      return { error: "Tous les champs sont requis." }
    }
    if (password.length < 6) {
      return { error: "Le mot de passe doit contenir au moins 6 caractères." }
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      console.error("[signUp] Supabase error:", error.message)
      return { error: error.message }
    }

    // Confirmation email requise par Supabase
    if (data.user && !data.session) {
      return { error: null, success: "Vérifiez votre boîte mail pour confirmer votre inscription." }
    }

    redirect("/dashboard")
  } catch (err) {
    // redirect() lance une exception interne — la laisser passer
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err
    console.error("[signUp] Unexpected error:", err)
    return { error: "Une erreur inattendue est survenue. Réessayez." }
  }
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = (formData.get("email") as string | null)?.trim()
    const password = formData.get("password") as string | null

    if (!email || !password) {
      return { error: "Email et mot de passe requis." }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error("[signIn] Supabase error:", error.message)
      return { error: "Email ou mot de passe incorrect." }
    }

    redirect("/dashboard")
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err
    console.error("[signIn] Unexpected error:", err)
    return { error: "Une erreur inattendue est survenue. Réessayez." }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
