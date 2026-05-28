"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/reset-password`,
    })
    if (err) {
      console.error("[forgot-password] Supabase error:", err)
      setError("Impossible d'envoyer l'email. Vérifiez votre adresse ou réessayez.")
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <>
        <div className="mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">Email envoyé !</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Vérifiez votre boîte mail. Cliquez sur le lien reçu pour réinitialiser votre mot de passe.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full text-center py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Retour à la connexion
        </Link>
      </>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Mot de passe oublié ?</h1>
        <p className="text-slate-500 text-sm mt-1">
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Envoi en cours…
              </>
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
          ← Retour à la connexion
        </Link>
      </p>
    </>
  )
}
