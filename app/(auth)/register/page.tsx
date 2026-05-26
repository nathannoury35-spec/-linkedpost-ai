"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signUp } from "@/app/actions/auth"
import SubmitButton from "@/components/auth/SubmitButton"

const initialState = { error: null }

export default function RegisterPage() {
  const [state, formAction] = useActionState(signUp, initialState)

  if (state.success) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Vérifiez votre email !</h2>
        <p className="text-slate-500 text-sm leading-relaxed">{state.success}</p>
        <Link href="/login" className="mt-6 inline-block text-sm text-blue-600 hover:text-blue-700 font-semibold">
          ← Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Créer votre compte</h1>
        <p className="text-slate-500 text-sm mt-1">Commencez à générer des posts LinkedIn en 30 secondes</p>
      </div>

      {state.error && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-1.5">
            Nom complet
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autoComplete="name"
            placeholder="Sophie Marchand"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.fr"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Minimum 6 caractères"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="pt-1">
          <SubmitButton label="Créer mon compte gratuit" loadingLabel="Création du compte…" />
        </div>
      </form>

      <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
        En vous inscrivant, vous acceptez nos{" "}
        <Link href="/terms" className="underline hover:text-slate-600">CGU</Link>{" "}
        et notre{" "}
        <Link href="/privacy" className="underline hover:text-slate-600">politique de confidentialité</Link>.
      </p>

      <p className="mt-4 text-center text-sm text-slate-500">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
          Se connecter
        </Link>
      </p>
    </>
  )
}
