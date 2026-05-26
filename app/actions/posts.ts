"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deletePost(postId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non connecté." }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/history")
  return {}
}

export async function markPostSaved(postId: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Non connecté." }

  const { error } = await supabase
    .from("posts")
    .update({ saved: true })
    .eq("id", postId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/history")
  return {}
}
