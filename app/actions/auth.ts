"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export type AuthState = { error: string | null; success?: string }

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string).trim()
  const password = formData.get("password") as string
  const fullName = (formData.get("full_name") as string).trim()

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

  if (error) return { error: error.message }

  // Confirmation email requise par Supabase
  if (data.user && !data.session) {
    return { error: null, success: "Vérifiez votre boîte mail pour confirmer votre inscription." }
  }

  redirect("/dashboard")
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get("email") as string).trim()
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email et mot de passe requis." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: "Email ou mot de passe incorrect." }

  redirect("/dashboard")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
