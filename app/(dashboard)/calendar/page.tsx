import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import CalendarView from "@/components/CalendarView"

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const isPro = profile?.role === "pro"

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  const { data: posts } = isPro
    ? await supabase
        .from("scheduled_posts")
        .select("id, content, scheduled_date, scheduled_time, email_reminder, status")
        .eq("user_id", user.id)
        .gte("scheduled_date", startDate)
        .lte("scheduled_date", endDate)
        .order("scheduled_date", { ascending: true })
        .order("scheduled_time", { ascending: true })
    : { data: [] }

  return (
    <CalendarView
      isPro={isPro}
      initialPosts={posts ?? []}
      initialYear={year}
      initialMonth={month - 1}
    />
  )
}
