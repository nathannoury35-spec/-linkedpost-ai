import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Non authentifié" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const month = parseInt(searchParams.get("month") ?? "1", 10)
  const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()), 10)

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  const { data: posts, error } = await supabase
    .from("scheduled_posts")
    .select("id, content, scheduled_date, scheduled_time, email_reminder, status")
    .eq("user_id", user.id)
    .gte("scheduled_date", startDate)
    .lte("scheduled_date", endDate)
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ posts: posts ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Non authentifié" }, { status: 401 })

  let body: { content: string; scheduled_date: string; scheduled_time: string; email_reminder: boolean }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Corps invalide" }, { status: 400 })
  }

  const { content, scheduled_date, scheduled_time, email_reminder } = body
  if (!content?.trim() || !scheduled_date) {
    return Response.json({ error: "Champs manquants" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert({
      user_id: user.id,
      content: content.trim(),
      scheduled_date,
      scheduled_time: scheduled_time ?? "09:00",
      email_reminder: email_reminder ?? true,
    })
    .select("id")
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ id: data.id }, { status: 201 })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Non authentifié" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return Response.json({ error: "id manquant" }, { status: 400 })

  const { error } = await supabase
    .from("scheduled_posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
