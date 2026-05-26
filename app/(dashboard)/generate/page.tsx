"use client"

import { useActionState, useState, useTransition, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { generatePost } from "@/app/actions/generate"
import { markPostSaved } from "@/app/actions/posts"
import { initialState, type GenerateState } from "@/app/actions/generate.types"
import { useFormStatus } from "react-dom"
import type { Tone, Format } from "@/lib/openai/prompts"
import PostScore from "@/components/PostScore"

/* ─── Constantes ────────────────────────────────────────────── */

const TONES: { value: Tone; label: string; emoji: string; description: string }[] = [
  { value: "professional", label: "Professionnel", emoji: "💼", description: "Expert & factuel" },
  { value: "inspirational", label: "Inspirant", emoji: "🔥", description: "Motivant & percutant" },
  { value: "storytelling", label: "Storytelling", emoji: "📖", description: "Histoire personnelle" },
  { value: "educational", label: "Éducatif", emoji: "🎓", description: "Conseils & méthodes" },
  { value: "casual", label: "Décontracté", emoji: "😎", description: "Naturel & humain" },
]

const FORMATS: { value: Format; label: string; words: string; desc: string }[] = [
  { value: "short", label: "Court", words: "~150 mots", desc: "Impact immédiat" },
  { value: "medium", label: "Moyen", words: "~300 mots", desc: "Équilibré" },
  { value: "long", label: "Long", words: "~500 mots", desc: "Développé" },
]

/* ─── Sous-composants ───────────────────────────────────────── */

function GenerateButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      name="action"
      value="generate"
      disabled={pending}
      className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
    >
      {pending ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Génération en cours…
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Générer mon post
        </>
      )}
    </button>
  )
}

function RegenerateButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      name="action"
      value="regenerate"
      disabled={pending}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 disabled:opacity-50 transition-all"
    >
      {pending ? (
        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )}
      Régénérer
    </button>
  )
}

function CreditBadge({ used, limit }: { used: number; limit: number }) {
  const remaining = limit - used
  const pct = Math.min((used / limit) * 100, 100)
  const color = remaining <= 1
    ? "text-red-600 dark:text-red-400"
    : remaining <= 2
    ? "text-amber-600 dark:text-amber-400"
    : "text-blue-600 dark:text-blue-400"
  const bgColor = remaining <= 1
    ? "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800"
    : remaining <= 2
    ? "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
    : "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
  const barColor = remaining <= 1 ? "bg-red-500" : remaining <= 2 ? "bg-amber-500" : "bg-gradient-to-r from-blue-500 to-violet-500"

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgColor} mb-6`}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Générations utilisées</span>
          <span className={`text-xs font-bold ${color}`}>{used} / {limit}</span>
        </div>
        <div className="h-1.5 bg-white dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className={`text-sm font-bold ${color}`}>
        {remaining} restante{remaining > 1 ? "s" : ""}
      </span>
    </div>
  )
}

function PostCard({
  state,
  post,
  onPostChange,
  onFavorite,
  isFavoriting,
  favorited,
}: {
  state: GenerateState
  post: string
  onPostChange: (text: string) => void
  onFavorite: () => void
  isFavoriting: boolean
  favorited: boolean
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    if (!post) return
    navigator.clipboard.writeText(post).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const wordCount = post.trim() ? post.trim().split(/\s+/).length : 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            LP
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">LinkedIn Preview</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{wordCount} mots · sauvegardé automatiquement</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 font-medium">
          ⚡ IA
        </span>
      </div>

      {/* Post content + score */}
      <div className="px-5 py-5">
        <div className="flex flex-col xl:flex-row gap-5">
          {/* Textarea éditable */}
          <textarea
            value={post}
            onChange={(e) => onPostChange(e.target.value)}
            rows={11}
            className="flex-1 min-w-0 bg-transparent resize-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed focus:outline-none placeholder-slate-400"
            placeholder="Votre post apparaîtra ici…"
          />
          {/* Score qualité */}
          <div className="xl:w-44 shrink-0 xl:border-l xl:border-slate-100 xl:dark:border-slate-700 xl:pl-5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 xl:text-center">
              Score qualité
            </p>
            <PostScore text={post} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            copied
              ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copié !
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copier
            </>
          )}
        </button>

        {/* Régénérer */}
        <RegenerateButton />

        {/* Favori — conserve le post au-delà de 30 jours */}
        {state.postId && (
          <button
            onClick={onFavorite}
            disabled={isFavoriting || favorited}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ml-auto ${
              favorited
                ? "bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 disabled:opacity-60"
            }`}
          >
            {favorited ? (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                En favoris
              </>
            ) : isFavoriting ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Ajout…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Favori
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Page principale ──────────────────────────────────────── */

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const [state, formAction] = useActionState(generatePost, initialState)
  const [tone, setTone] = useState<Tone>("professional")
  const [format, setFormat] = useState<Format>("medium")
  const [favorited, setFavorited] = useState(false)
  const [isFavoriting, startFavoritingTransition] = useTransition()
  const [editablePost, setEditablePost] = useState("")
  const [topic, setTopic] = useState("")
  const [hookActive, setHookActive] = useState(false)

  // Pré-remplissage depuis le query param ?hook=
  useEffect(() => {
    const hook = searchParams.get("hook")
    if (hook) {
      setTopic(hook)
      setHookActive(true)
    }
  }, [searchParams])

  // Sync avec le post généré (reset si nouveau post)
  useEffect(() => {
    if (state.post) setEditablePost(state.post)
  }, [state.post])

  function handleFavorite() {
    if (!state.postId) return
    startFavoritingTransition(async () => {
      const result = await markPostSaved(state.postId!)
      if (!result.error) setFavorited(true)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Générer un post LinkedIn</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Décrivez votre sujet et laissez l&apos;IA rédiger pour vous.</p>
      </div>

      {/* Credits si connus */}
      {state.creditsUsed !== null && state.creditsLimit !== null && (
        <CreditBadge used={state.creditsUsed} limit={state.creditsLimit} />
      )}

      <form
        action={formAction}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        onSubmit={() => setFavorited(false)}
      >

        {/* ── Colonne gauche : Formulaire ── */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-5">

            {/* Métier */}
            <div>
              <label htmlFor="job_title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Votre métier
              </label>
              <input
                id="job_title"
                name="job_title"
                type="text"
                required
                defaultValue={state.params?.jobTitle}
                placeholder="ex: développeur freelance, coach en leadership, consultant RH…"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Sujet */}
            <div>
              <label htmlFor="topic" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Sujet du post
              </label>

              {/* Badge hook viral */}
              {hookActive && (
                <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex-1">
                    ✨ Hook viral sélectionné
                  </span>
                  <button
                    type="button"
                    onClick={() => { setHookActive(false); setTopic("") }}
                    className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                    aria-label="Effacer le hook"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <textarea
                id="topic"
                name="topic"
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="ex: comment trouver ses premiers clients en freelance, les erreurs à éviter quand on fixe ses tarifs…"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Ton */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Ton du post</label>
              <div className="grid grid-cols-1 gap-2">
                {TONES.map((t) => (
                  <label
                    key={t.value}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                      tone === t.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={t.value}
                      checked={tone === t.value}
                      onChange={() => setTone(t.value)}
                      className="sr-only"
                    />
                    <span className="text-lg leading-none">{t.emoji}</span>
                    <div className="flex-1">
                      <span className="text-sm font-semibold block">{t.label}</span>
                      <span className="text-xs opacity-70">{t.description}</span>
                    </div>
                    {tone === t.value && (
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Format</label>
              <div className="grid grid-cols-3 gap-2">
                {FORMATS.map((f) => (
                  <label
                    key={f.value}
                    className={`flex flex-col items-center text-center px-3 py-3 rounded-xl border cursor-pointer transition-all ${
                      format === f.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={f.value}
                      checked={format === f.value}
                      onChange={() => setFormat(f.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-bold">{f.label}</span>
                    <span className="text-xs font-medium opacity-80">{f.words}</span>
                    <span className="text-xs opacity-60 mt-0.5">{f.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <GenerateButton />
          </div>
        </div>

        {/* ── Colonne droite : Résultat ── */}
        <div className="flex flex-col gap-4">
          {/* Limite atteinte */}
          {state.limitReached && (
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Limite mensuelle atteinte</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    Vous avez atteint votre limite de {state.creditsLimit} post{(state.creditsLimit ?? 0) > 1 ? "s" : ""} ce mois-ci.
                    Passez au plan Starter pour continuer.
                  </p>
                </div>
              </div>
              <a
                href="/billing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Voir les plans
              </a>
            </div>
          )}

          {/* Erreur */}
          {state.error && (
            <div className="flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-3.5 text-sm text-red-700 dark:text-red-400">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{state.error}</span>
            </div>
          )}

          {/* Post généré */}
          {state.post ? (
            <PostCard
              state={state}
              post={editablePost}
              onPostChange={setEditablePost}
              onFavorite={handleFavorite}
              isFavoriting={isFavoriting}
              favorited={favorited}
            />
          ) : (
            /* Placeholder vide */
            <div className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-10 min-h-64">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="font-semibold text-slate-600 dark:text-slate-400 mb-1">Votre post apparaîtra ici</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Remplissez le formulaire et cliquez sur<br />&quot;Générer mon post&quot;</p>
            </div>
          )}

          {/* Conseils */}
          {!state.post && (
            <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 rounded-2xl border border-blue-100 dark:border-blue-900 p-5">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-3">Conseils pour de meilleurs posts</p>
              <ul className="space-y-2">
                {[
                  "Soyez spécifique dans votre sujet (évitez les généralités)",
                  "Mentionnez une expérience personnelle concrète",
                  "Testez différents tons pour trouver votre voix",
                  "Le ton Storytelling génère souvent le plus d'engagement",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300">
                    <svg className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
