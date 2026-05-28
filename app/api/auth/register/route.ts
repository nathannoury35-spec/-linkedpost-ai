import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    let body: { email: string; password: string; full_name: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Corps invalide" }, { status: 400 })
    }

    const { full_name, email, password } = body

    if (!full_name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères." }, { status: 400 })
    }

    console.log("[register] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40))
    console.log("[register] Anon key présente:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: full_name.trim() } },
    })

    if (error) {
      console.error("[POST /api/auth/register] Supabase error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Confirmation email requise — pas de session immédiate
    if (data.user && !data.session) {
      return NextResponse.json({ success: "Vérifiez votre boîte mail pour confirmer votre inscription." })
    }

    console.log("[POST /api/auth/register] Inscription réussie pour:", email.trim())
    return NextResponse.json({ redirect: "/dashboard" })
  } catch (err) {
    console.error("[POST /api/auth/register] Unexpected error:", err)
    return NextResponse.json({ error: "Une erreur inattendue est survenue." }, { status: 500 })
  }
}
