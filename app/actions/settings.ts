"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type SettingsState = { error: string | null; success: string | null }
const ok = (msg: string): SettingsState => ({ error: null, success: msg })
const err = (msg: string): SettingsState => ({ error: msg, success: null })

export async function updateProfile(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const fullName = (formData.get("full_name") as string).trim()
  if (!fullName) return err("Le nom ne peut pas être vide.")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return err("Non connecté.")

  const [authUpdate, dbUpdate] = await Promise.all([
    supabase.auth.updateUser({ data: { full_name: fullName } }),
    supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id),
  ])

  if (authUpdate.error) return err(authUpdate.error.message)
  if (dbUpdate.error) return err(dbUpdate.error.message)

  revalidatePath("/settings")
  return ok("Nom mis à jour avec succès.")
}

export async function updateEmail(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const email = (formData.get("email") as string).trim()
  if (!email || !email.includes("@")) return err("Adresse email invalide.")

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ email })

  if (error) return err(error.message)
  return ok("Un lien de confirmation a été envoyé à votre nouvelle adresse.")
}

export async function updatePassword(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const password = formData.get("password") as string
  const confirm = formData.get("confirm_password") as string

  if (!password || password.length < 6) return err("Le mot de passe doit contenir au moins 6 caractères.")
  if (password !== confirm) return err("Les mots de passe ne correspondent pas.")

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) return err(error.message)
  return ok("Mot de passe mis à jour avec succès.")
}

export async function deleteAccount(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Déconnexion immédiate
  await supabase.auth.signOut()

  // Suppression via admin client (nécessite service_role)
  const admin = createAdminClient()
  await admin.auth.admin.deleteUser(user.id)

  redirect("/")
}
