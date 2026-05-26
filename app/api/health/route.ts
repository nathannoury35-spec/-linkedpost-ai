import { createClient } from "@/lib/supabase/server"

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.getSession()
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 })
    return Response.json({ ok: true, supabase: "connecté" })
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
