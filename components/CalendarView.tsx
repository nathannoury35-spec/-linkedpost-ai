"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

/* ─── Types ──────────────────────────────────────────────────── */

type ScheduledPost = {
  id: string
  content: string
  scheduled_date: string
  scheduled_time: string
  email_reminder: boolean
  status: string
}

/* ─── Constantes ─────────────────────────────────────────────── */

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const TIME_SLOTS = [
  { label: "8h00", value: "08:00" },
  { label: "9h00", value: "09:00" },
  { label: "10h00", value: "10:00" },
  { label: "11h00", value: "11:00" },
  { label: "12h00", value: "12:00" },
  { label: "17h00", value: "17:00" },
  { label: "18h00", value: "18:00" },
  { label: "19h00", value: "19:00" },
]

/* ─── Helpers ────────────────────────────────────────────────── */

function formatTime(t: string) {
  const [h, m] = t.split(":")
  return `${parseInt(h)}h${m === "00" ? "00" : m}`
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function formatDateLabel(dateStr: string) {
  const [y, m, d] = dateStr.split("-")
  return `${parseInt(d)} ${MONTHS_FR[parseInt(m) - 1]} ${y}`
}

/* ─── Composant principal ────────────────────────────────────── */

export default function CalendarView({
  isPro,
  initialPosts,
  initialYear,
  initialMonth,
}: {
  isPro: boolean
  initialPosts: ScheduledPost[]
  initialYear: number
  initialMonth: number
}) {
  const today = new Date()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts)
  const [loading, setLoading] = useState(false)

  // Modal
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<"create" | "view" | null>(null)
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)

  // Form
  const [content, setContent] = useState("")
  const [time, setTime] = useState("09:00")
  const [emailReminder, setEmailReminder] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ── Navigation mois ────────────────────────────────────────
  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // ── Fetch posts ────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/calendar?month=${month + 1}&year=${year}`)
    if (res.ok) {
      const data = await res.json()
      setPosts(data.posts ?? [])
    }
    setLoading(false)
  }, [month, year])

  useEffect(() => {
    if (isPro) fetchPosts()
  }, [fetchPosts, isPro])

  // ── Grille calendrier ──────────────────────────────────────
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayRaw = new Date(year, month, 1).getDay() // 0=Sun
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1 // Mon=0

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  // Index posts par date
  const postsByDate: Record<string, ScheduledPost[]> = {}
  for (const p of posts) {
    if (!postsByDate[p.scheduled_date]) postsByDate[p.scheduled_date] = []
    postsByDate[p.scheduled_date].push(p)
  }

  // ── Actions ───────────────────────────────────────────────
  function openCreate(dateStr: string) {
    setSelectedDate(dateStr)
    setContent("")
    setTime("09:00")
    setEmailReminder(true)
    setSelectedPost(null)
    setModalMode("create")
  }

  function openView(post: ScheduledPost) {
    setSelectedPost(post)
    setSelectedDate(post.scheduled_date)
    setModalMode("view")
  }

  function handleDayClick(d: number) {
    const dateStr = toDateStr(year, month, d)
    const dayPosts = postsByDate[dateStr] ?? []
    if (dayPosts.length > 0) openView(dayPosts[0])
    else openCreate(dateStr)
  }

  async function handleCreate() {
    if (!content.trim() || !selectedDate) return
    setSaving(true)
    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, scheduled_date: selectedDate, scheduled_time: time, email_reminder: emailReminder }),
    })
    if (res.ok) { await fetchPosts(); setModalMode(null) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!selectedPost) return
    setDeleting(true)
    const res = await fetch(`/api/calendar?id=${selectedPost.id}`, { method: "DELETE" })
    if (res.ok) { await fetchPosts(); setModalMode(null) }
    setDeleting(false)
  }

  // ── Sidebar stats ──────────────────────────────────────────
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const postsThisWeek = posts.filter(p => {
    const d = new Date(p.scheduled_date + "T00:00:00")
    return d >= startOfWeek && d <= endOfWeek
  }).length

  const upcoming = [...posts]
    .filter(p => p.scheduled_date >= todayStr)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date) || a.scheduled_time.localeCompare(b.scheduled_time))
    .slice(0, 3)

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Calendrier de contenu
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Planifiez vos posts LinkedIn et recevez des rappels email.
          </p>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">

        {/* ── Calendrier ── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Nav mois */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <button
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg capitalize">
                {MONTHS_FR[month]} {year}
              </h2>
              {loading && (
                <span className="text-xs text-slate-400 dark:text-slate-500">Chargement…</span>
              )}
            </div>

            <button
              onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* En-têtes jours */}
          <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700">
            {DAYS_SHORT.map(d => (
              <div key={d} className="py-2.5 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Grille jours */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[80px] p-2 bg-slate-50/50 dark:bg-slate-900/30 border-b border-r border-slate-100 dark:border-slate-700/50"
                  />
                )
              }

              const dateStr = toDateStr(year, month, day)
              const isToday = dateStr === todayStr
              const dayPosts = postsByDate[dateStr] ?? []
              const hasPosts = dayPosts.length > 0
              const isPast = dateStr < todayStr

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[80px] p-2 text-left transition-colors border-b border-r border-slate-100 dark:border-slate-700/50 group ${
                    isPast && !hasPosts
                      ? "bg-white dark:bg-slate-800 opacity-50 cursor-default"
                      : "bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold mb-1 transition-colors ${
                    isToday
                      ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white"
                      : hasPosts
                      ? "text-blue-700 dark:text-blue-400 font-bold"
                      : "text-slate-700 dark:text-slate-300"
                  }`}>
                    {day}
                  </span>

                  {hasPosts && (
                    <div className="space-y-1">
                      {dayPosts.slice(0, 2).map(post => (
                        <div key={post.id} className="flex items-start gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0 mt-1" />
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight line-clamp-1">
                            {post.content.slice(0, 30)}
                            {post.content.length > 30 ? "…" : ""}
                          </span>
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <span className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold pl-2.5">
                          +{dayPosts.length - 2} autres
                        </span>
                      )}
                    </div>
                  )}

                  {!hasPosts && !isPast && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-blue-400 dark:text-blue-500 font-medium">+ Planifier</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Posts cette semaine */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Cette semaine</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                {postsThisWeek}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  post{postsThisWeek !== 1 ? "s" : ""} planifié{postsThisWeek !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">cette semaine</p>
              </div>
            </div>
          </div>

          {/* Prochains posts */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Prochains posts
            </p>
            {upcoming.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-3">
                Aucun post planifié
              </p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(post => (
                  <button
                    key={post.id}
                    onClick={() => openView(post)}
                    className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0 mt-1.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">
                        {formatDateLabel(post.scheduled_date)} · {formatTime(post.scheduled_time)}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-snug">
                        {post.content.slice(0, 60)}{post.content.length > 60 ? "…" : ""}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Conseil */}
          <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 rounded-2xl border border-blue-100 dark:border-blue-900 p-5">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">Astuce engagement</p>
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              💡 <strong>Meilleurs jours :</strong> Mardi, Mercredi, Jeudi.<br />
              <strong>Meilleures heures :</strong> 8h–9h et 17h–18h.
            </p>
          </div>
        </div>
      </div>

      {/* ── Overlay Pro ─────────────────────────────────────────── */}
      {!isPro && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl">
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl" />
          <div className="relative z-10 text-center px-8 py-10 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg shadow-amber-500/30">
              📅
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              Fonctionnalité Pro
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Le calendrier de contenu et les rappels email sont réservés au plan Pro. Planifiez vos posts à l&apos;avance et ne ratez plus jamais le bon moment.
            </p>
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Passer au Pro — 29€/mois
            </Link>
          </div>
        </div>
      )}

      {/* ── Modal "Planifier un post" ────────────────────────────── */}
      {modalMode === "create" && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalMode(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">
                Planifier un post
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
              <svg className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {formatDateLabel(selectedDate)}
              </span>
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Contenu du post
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={6}
                placeholder="Rédigez votre post LinkedIn ici…"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">
                {content.length} caractères
              </p>
            </div>

            {/* Heure */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Heure de publication
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setTime(slot.value)}
                    className={`py-2 rounded-xl text-sm font-semibold transition-all border ${
                      time === slot.value
                        ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rappel email */}
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={emailReminder}
                  onChange={e => setEmailReminder(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  emailReminder
                    ? "bg-blue-600 border-blue-600"
                    : "border-slate-300 dark:border-slate-500"
                }`}>
                  {emailReminder && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Recevoir un rappel email 1h avant
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Un email sera envoyé à votre adresse à {formatTime(time)} (- 1h)
                </p>
              </div>
            </label>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setModalMode(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !content.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
              >
                {saving ? "Planification…" : "Planifier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal "Voir/Supprimer" ───────────────────────────────── */}
      {modalMode === "view" && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalMode(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">Post planifié</h3>
              <button
                onClick={() => setModalMode(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {formatDateLabel(selectedPost.scheduled_date)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/50 border border-violet-100 dark:border-violet-900">
                <svg className="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
                  {formatTime(selectedPost.scheduled_time)}
                </span>
              </div>
              {selectedPost.status === "reminded" && (
                <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 text-xs font-bold">
                  Rappel envoyé
                </span>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </p>
            </div>

            {selectedPost.email_reminder && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Rappel email activé
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Suppression…" : "Supprimer"}
              </button>
              <button
                onClick={() => setModalMode(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
