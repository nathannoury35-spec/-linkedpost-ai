"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

/* ─── Données statiques ─────────────────────────────────────── */

const SECTEURS = ["Tech", "Marketing", "RH", "Finance", "Design", "Consulting", "Autre"]

const STYLES = [
  {
    id: "expert",
    label: "Expert & Factuel",
    preview: "Voici 5 erreurs que font 90% des freelances en 2024...",
    tone: "professional",
  },
  {
    id: "inspiring",
    label: "Inspirant & Storytelling",
    preview: "Il y a 2 ans, je gagnais 1 200€/mois. Aujourd'hui...",
    tone: "storytelling",
  },
  {
    id: "pedagogical",
    label: "Pédagogue",
    preview: "Comment trouver ses premiers clients en 3 étapes simples...",
    tone: "educational",
  },
  {
    id: "authentic",
    label: "Authentique",
    preview: "Je vais être honnête avec vous. Le freelancing, c'est dur...",
    tone: "casual",
  },
] as const

/* ─── Composant Progress bar ────────────────────────────────── */

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center">
          {i > 0 && (
            <div
              className={`h-0.5 w-16 sm:w-24 mx-1 transition-colors ${
                step > i ? "bg-blue-500" : "bg-slate-700"
              }`}
            />
          )}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              step > n
                ? "bg-blue-600 border-blue-600 text-white"
                : step === n
                ? "bg-blue-600 border-blue-600 text-white ring-4 ring-blue-600/20"
                : "bg-slate-800 border-slate-600 text-slate-400"
            }`}
          >
            {step > n ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              n
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Page principale ───────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Étape 1
  const [metier, setMetier] = useState("")
  const [secteur, setSecteur] = useState("")
  const [clientsCibles, setClientsCibles] = useState("")

  // Étape 2
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)

  // Étape 3
  const [loading, setLoading] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Vérification auth côté client
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login")
    })
  }, [router])

  /* ── Passage étape 2 → 3 ── */
  async function handleCompleteOnboarding() {
    if (!selectedStyle) return

    setCurrentStep(3)
    setLoading(true)
    setGenerateError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const style = STYLES.find((s) => s.id === selectedStyle)!

    // Sauvegarde du profil avec onboarding_completed = true
    await supabase
      .from("profiles")
      .update({
        metier,
        secteur,
        clients_cibles: clientsCibles,
        style_linkedin: style.label,
        onboarding_completed: true,
      })
      .eq("id", user.id)

    // Génération du premier post
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Présentation de mon activité de ${metier}`,
          tone: style.tone,
          format: "medium",
          metier,
          secteur,
          clients_cibles: clientsCibles,
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setGenerateError(data.error ?? "La génération a échoué.")
      } else {
        setGeneratedPost(data.post)
      }
    } catch {
      setGenerateError("Erreur réseau. Vérifiez votre connexion.")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!generatedPost) return
    navigator.clipboard.writeText(generatedPost).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  /* ── Rendu ── */
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 font-bold text-lg">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white font-black text-sm">
          L
        </span>
        <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          LinkedPost AI
        </span>
      </div>

      <div className="w-full max-w-xl">
        <ProgressBar step={currentStep} />

        {/* ── ÉTAPE 1 ── */}
        {currentStep === 1 && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-7 shadow-xl">
            <h1 className="text-2xl font-extrabold text-white mb-1">Parle-moi de toi</h1>
            <p className="text-slate-400 text-sm mb-7">Ces informations personnalisent chaque post que tu génères.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Ton métier exact
                </label>
                <input
                  type="text"
                  value={metier}
                  onChange={(e) => setMetier(e.target.value)}
                  placeholder="Développeur freelance, Coach business..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Ton secteur
                </label>
                <select
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                >
                  <option value="">Sélectionne ton secteur...</option>
                  {SECTEURS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Tes clients cibles
                </label>
                <input
                  type="text"
                  value={clientsCibles}
                  onChange={(e) => setClientsCibles(e.target.value)}
                  placeholder="Startups, PME, Grands comptes..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!metier.trim() || !secteur || !clientsCibles.trim()}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
              >
                Continuer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 ── */}
        {currentStep === 2 && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-7 shadow-xl">
            <h1 className="text-2xl font-extrabold text-white mb-1">Quel est ton style LinkedIn ?</h1>
            <p className="text-slate-400 text-sm mb-7">Choisis la façon dont tu veux t&apos;exprimer.</p>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedStyle === style.id
                      ? "border-blue-500 bg-blue-600/10 ring-2 ring-blue-500/30"
                      : "border-slate-600 bg-slate-900 hover:border-slate-500"
                  }`}
                >
                  <p className={`text-sm font-bold mb-1.5 ${selectedStyle === style.id ? "text-blue-400" : "text-white"}`}>
                    {style.label}
                  </p>
                  <p className="text-xs text-slate-400 italic">&ldquo;{style.preview}&rdquo;</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 border border-slate-600 hover:border-slate-500 hover:text-white transition-all"
              >
                Retour
              </button>
              <button
                onClick={handleCompleteOnboarding}
                disabled={!selectedStyle}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Continuer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 ── */}
        {currentStep === 3 && (
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-7 shadow-xl">
            <h1 className="text-2xl font-extrabold text-white mb-1">Génération de votre premier post !</h1>
            <p className="text-slate-400 text-sm mb-7">Voici un avant-goût de ce que LinkedPost AI peut créer pour toi.</p>

            {loading && (
              <div className="flex flex-col items-center justify-center py-14 gap-4">
                <div className="relative w-14 h-14">
                  <svg className="animate-spin w-14 h-14 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                </div>
                <p className="text-slate-300 text-sm font-medium">Génération de votre post personnalisé…</p>
                <p className="text-slate-500 text-xs">Cela prend quelques secondes</p>
              </div>
            )}

            {!loading && generateError && (
              <div className="mb-5">
                <div className="flex items-start gap-3 rounded-xl bg-red-950/50 border border-red-800 px-4 py-3.5 text-sm text-red-400 mb-4">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{generateError}</span>
                </div>
                <Link
                  href="/generate"
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  Accéder au générateur
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </Link>
              </div>
            )}

            {!loading && generatedPost && (
              <div className="space-y-4">
                <textarea
                  readOnly
                  value={generatedPost}
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-slate-200 text-sm leading-relaxed resize-none focus:outline-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all border ${
                      copied
                        ? "bg-green-950/50 border-green-700 text-green-400"
                        : "bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copié !
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copier le post
                      </>
                    )}
                  </button>

                  <Link
                    href="/generate"
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    Accéder au générateur
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
