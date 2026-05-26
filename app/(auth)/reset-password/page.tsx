"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Nouveau mot de passe</h1>
        <p className="text-slate-500 text-sm mt-1">Choisissez un nouveau mot de passe sécurisé.</p>
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
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nouveau mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Minimum 8 caractères"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
            Confirmer le mot de passe
          </label>
          <input
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
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
                Mise à jour…
              </>
            ) : (
              "Mettre à jour le mot de passe"
            )}
          </button>
        </div>
      </form>
    </>
  )
}
