import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const PROTECTED_ROUTES = ["/dashboard", "/generate", "/history", "/settings", "/billing"]
const AUTH_ROUTES = ["/login", "/register"]
const ONBOARDING_ROUTE = "/onboarding"

function isProtected(pathname: string) {
  return PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
}

function isAuth(pathname: string) {
  return AUTH_ROUTES.some((r) => pathname.startsWith(r))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isOnboarding = pathname === ONBOARDING_ROUTE

  // Routes publiques : laisser passer sans toucher à Supabase
  if (!isProtected(pathname) && !isAuth(pathname) && !isOnboarding) {
    return NextResponse.next()
  }

  // Clés manquantes (env non configuré) : laisser passer sans crash
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Non connecté → redirige vers /login depuis les routes protégées
  if (!user && (isProtected(pathname) || isOnboarding)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Connecté → redirige hors des pages d'auth
  if (user && isAuth(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Connecté sur une route du dashboard → vérifie l'onboarding
  if (user && isProtected(pathname)) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single()

      if (profile && !profile.onboarding_completed) {
        const url = request.nextUrl.clone()
        url.pathname = ONBOARDING_ROUTE
        return NextResponse.redirect(url)
      }
    } catch {
      // En cas d'erreur DB (migration non appliquée), on laisse passer
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
