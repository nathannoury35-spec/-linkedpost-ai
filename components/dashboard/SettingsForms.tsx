"use client"

import { useActionState, useTransition, useState } from "react"
import { useFormStatus } from "react-dom"
import { updateProfile, updateEmail, updatePassword, deleteAccount } from "@/app/actions/settings"
import type { SettingsState } from "@/app/actions/settings"
import ThemeToggle from "@/components/theme/ThemeToggle"

const emptyState: SettingsState = { error: null, success: null }

/* ── Bouton submit réutilisable ── */
function SubmitBtn({ label, loadingLabel, danger = false }: { label: string; loadingLabel: string; danger?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
        danger
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
      }`}
    >
      {pending && (
        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {pending ? loadingLabel : label}
    </button>
  )
}

/* ── Feedback inline ── */
function Feedback({ state }: { state: SettingsState }) {
  if (!state.error && !state.success) return null
  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm mt-4 ${
      state.error
        ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
        : "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
    }`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        {state.error ? (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        ) : (
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        )}
      </svg>
      {state.error ?? state.success}
    </div>
  )
}

/* ── Input field ── */
function Field({ id, label, type = "text", defaultValue, placeholder, required = true }: {
  id: string; label: string; type?: string; defaultValue?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <input
        id={id} name={id} type={type}
        defaultValue={defaultValue} placeholder={placeholder}
        required={required} autoComplete={type === "password" ? "new-password" : undefined}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  )
}

/* ── Section card wrapper ── */
function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

/* ── Composant principal ── */
export default function SettingsForms({
  fullName,
  email,
}: {
  fullName: string
  email: string
}) {
  const [profileState, profileAction] = useActionState(updateProfile, emptyState)
  const [emailState, emailAction] = useActionState(updateEmail, emptyState)
  const [passwordState, passwordAction] = useActionState(updatePassword, emptyState)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [, startDeleteTransition] = useTransition()

  function handleDeleteAccount() {
    startDeleteTransition(async () => {
      await deleteAccount()
    })
  }

  return (
    <div className="space-y-6">

      {/* ── Apparence ── */}
      <Section title="Apparence" description="Choisissez entre le thème clair et le thème sombre.">
        <div className="flex items-center justify-between max-w-md">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Thème sombre</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Activez le mode sombre pour réduire la fatigue visuelle.</p>
          </div>
          <ThemeToggle />
        </div>
      </Section>

      {/* ── Profil ── */}
      <Section title="Informations personnelles" description="Modifiez votre nom affiché sur le dashboard.">
        <form action={profileAction}>
          <div className="max-w-md space-y-4">
            <Field id="full_name" label="Nom complet" defaultValue={fullName} placeholder="Sophie Marchand" />
            <div className="flex items-center gap-3">
              <SubmitBtn label="Enregistrer" loadingLabel="Enregistrement…" />
            </div>
            <Feedback state={profileState} />
          </div>
        </form>
      </Section>

      {/* ── Email ── */}
      <Section title="Adresse email" description="Un email de confirmation sera envoyé à la nouvelle adresse.">
        <form action={emailAction}>
          <div className="max-w-md space-y-4">
            <Field id="email" label="Nouvelle adresse email" type="email" defaultValue={email} placeholder="vous@exemple.fr" />
            <div className="flex items-center gap-3">
              <SubmitBtn label="Changer l'email" loadingLabel="Envoi en cours…" />
            </div>
            <Feedback state={emailState} />
          </div>
        </form>
      </Section>

      {/* ── Mot de passe ── */}
      <Section title="Mot de passe" description="Choisissez un mot de passe d'au moins 6 caractères.">
        <form action={passwordAction}>
          <div className="max-w-md space-y-4">
            <Field id="password" label="Nouveau mot de passe" type="password" placeholder="••••••••" />
            <Field id="confirm_password" label="Confirmer le mot de passe" type="password" placeholder="••••••••" />
            <div className="flex items-center gap-3">
              <SubmitBtn label="Changer le mot de passe" loadingLabel="Mise à jour…" />
            </div>
            <Feedback state={passwordState} />
          </div>
        </form>
      </Section>

      {/* ── Danger zone ── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900 overflow-hidden">
        <div className="px-6 py-5 border-b border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/40">
          <h2 className="font-bold text-red-700 dark:text-red-400">Zone de danger</h2>
          <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">Ces actions sont irréversibles. Procédez avec précaution.</p>
        </div>
        <div className="px-6 py-5">
          {!confirmDelete ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">Supprimer mon compte</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Supprime définitivement votre compte et tous vos posts.</p>
              </div>
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                Supprimer le compte
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-4">
              <p className="font-semibold text-red-700 dark:text-red-400 text-sm mb-1">Êtes-vous sûr(e) ?</p>
              <p className="text-xs text-red-600 dark:text-red-500 mb-4">
                Cette action supprimera définitivement votre compte, vos posts et vos données. Elle est irréversible.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Oui, supprimer définitivement
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
