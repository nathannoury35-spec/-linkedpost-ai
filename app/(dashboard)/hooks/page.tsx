import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import HooksClient from "./HooksClient"

export default async function HooksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = (profile?.role ?? "free") as "free" | "starter" | "pro"

  return <HooksClient role={role} />
}
