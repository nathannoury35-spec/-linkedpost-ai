import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    let body: { email: string; password: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Corps invalide" }, { status: 400 })
    }

    const { email, password } = body

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      console.error("[POST /api/auth/login] Supabase error:", error.message)
      return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 })
    }

    console.log("[POST /api/auth/login] Connexion réussie pour:", email.trim())
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[POST /api/auth/login] Unexpected error:", err)
    return NextResponse.json({ error: "Une erreur inattendue est survenue." }, { status: 500 })
  }
}
