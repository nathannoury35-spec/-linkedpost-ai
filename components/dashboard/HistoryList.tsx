"use client"

import { useState, useTransition } from "react"
import { deletePost, markPostSaved } from "@/app/actions/posts"

interface Post {
  id: string
  content: string
  tone: string
  format: string
  topic: string
  job_title: string
  created_at: string
  word_count: number | null
  saved: boolean
}

const TONE_META: Record<string, { label: string; color: string; emoji: string }> = {
  professional:  { label: "Professionnel", color: "bg-blue-100 text-blue-700",     emoji: "💼" },
  inspirational: { label: "Inspirant",     color: "bg-orange-100 text-orange-700", emoji: "🔥" },
  storytelling:  { label: "Storytelling",  color: "bg-violet-100 text-violet-700", emoji: "📖" },
  educational:   { label: "Éducatif",      color: "bg-green-100 text-green-700",   emoji: "🎓" },
  casual:        { label: "Décontracté",   color: "bg-pink-100 text-pink-700",     emoji: "😎" },
}

const FORMAT_LABELS: Record<string, string> = {
  short: "Court", medium: "Moyen", long: "Long",
}

function getDaysUntilExpiry(createdAt: string): number {
  const expiry = new Date(createdAt).getTime() + 30 * 24 * 60 * 60 * 1000
  return Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24))
}

/* ── Texte dépliable ──────────────────────────────────────── */

function ExpandableContent({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false)
  // Seuil heuristique : 3 lignes ≈ 180 caractères à ~60 chars/ligne
  const isLong = content.length > 180

  return (
    <>
      <div
        className={`relative overflow-hidden transition-[max-height] ease-in-out ${
          expanded ? "max-h-[2000px] duration-500" : "max-h-[4.5rem] duration-300"
        }`}
      >
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
          {content}
        </p>
        {/* Dégradé de fin visible uniquement quand replié */}
        {!expanded && isLong && (
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white dark:from-slate-800 to-transparent pointer-events-none" />
        )}
      </div>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {expanded ? (
            <>
              <svg className="w-3.5 h-3.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
              Réduire
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
              Voir le post complet
            </>
          )}
        </button>
      )}
    </>
  )
}

/* ── Bouton copier ────────────────────────────────────────── */

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
        copied
          ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copié
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copier
        </>
      )}
    </button>
  )
}

/* ── Liste principale ─────────────────────────────────────── */

export default function HistoryList({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function handleDelete(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      const result = await deletePost(id)
      if (!result.error) setPosts(prev => prev.filter(p => p.id !== id))
      setDeletingId(null)
    })
  }

  function handleSave(id: string) {
    setSavingId(id)
    startTransition(async () => {
      const result = await markPostSaved(id)
      if (!result.error) setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: true } : p))
      setSavingId(null)
    })
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Aucun post dans l&apos;historique</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">Générez votre premier post LinkedIn pour le voir apparaître ici.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {posts.map((post) => {
        const tone = TONE_META[post.tone] ?? { label: post.tone, color: "bg-slate-100 text-slate-600", emoji: "📝" }
        const format = FORMAT_LABELS[post.format] ?? post.format
        const date = new Date(post.created_at).toLocaleDateString("fr-FR", {
          day: "numeric", month: "long", year: "numeric",
        })
        const isDeleting = deletingId === post.id
        const isSaving = savingId === post.id
        const daysLeft = getDaysUntilExpiry(post.created_at)

        return (
          <div
            key={post.id}
            className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-200 ${
              isDeleting ? "opacity-40 scale-[0.99]" : "hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600"
            }`}
          >
            {/* ── Header ── */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${tone.color}`}>
                  <span>{tone.emoji}</span>
                  {tone.label}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {format}
                </span>
                {post.word_count && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">{post.word_count} mots</span>
                )}
                {!post.saved && daysLeft <= 30 && daysLeft > 0 && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    daysLeft <= 3
                      ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                      : daysLeft <= 7
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Expire dans {daysLeft}j
                  </span>
                )}
                {post.saved && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Favori
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2">{date}</span>
            </div>

            {/* ── Sujet ── */}
            <div className="px-5 pt-4 pb-2">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Sujet</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{post.topic}</p>
            </div>

            {/* ── Contenu dépliable ── */}
            <div className="px-5 pb-4">
              <ExpandableContent content={post.content} />
            </div>

            {/* ── Actions ── */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 flex-wrap">
              <CopyButton content={post.content} />

              {!post.saved && (
                <button
                  onClick={() => handleSave(post.id)}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900 disabled:opacity-50 transition-all"
                >
                  {isSaving ? (
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                  Favori
                </button>
              )}

              <button
                onClick={() => handleDelete(post.id)}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-50 transition-all ml-auto"
              >
                {isDeleting ? (
                  <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                Supprimer
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
