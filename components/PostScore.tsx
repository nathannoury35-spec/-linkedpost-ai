"use client"

import { useMemo, useEffect, useState } from "react"

/* ─── Calcul du score ───────────────────────────────────────── */

type ScoreResult = {
  total: number
  strengths: string[]
  improvements: string[]
}

function computeScore(text: string): ScoreResult {
  if (!text.trim()) return { total: 0, strengths: [], improvements: [] }

  let total = 0
  const strengths: string[] = []
  const improvements: string[] = []

  // 1. Longueur (20 pts)
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words < 50) {
    total += 5
    improvements.push("Post trop court (< 50 mots)")
  } else if (words <= 150) {
    total += 15
    improvements.push("Longueur ok, peut être plus développé")
  } else if (words <= 400) {
    total += 20
    strengths.push("Longueur idéale")
  } else {
    total += 12
    improvements.push("Post trop long (> 400 mots)")
  }

  // 2. Hook — 100 premiers caractères (25 pts max)
  const hook = text.slice(0, 100)
  if (/\d/.test(hook)) {
    total += 10
    strengths.push("Chiffre ou stat en accroche")
  } else {
    improvements.push("Ajoute un chiffre dans l'accroche")
  }
  if (/\?/.test(hook)) {
    total += 8
    strengths.push("Question en accroche")
  } else {
    improvements.push("Commence par une question")
  }
  if (/\b(je|mon|ma|vous|votre)\b/i.test(hook)) {
    total += 7
    strengths.push("Ton personnel (Je / Mon / Ma)")
  } else {
    improvements.push("Utilise 'Je' ou 'Mon' pour personnaliser")
  }

  // 3. Structure (20 pts max)
  if (/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(text)) {
    total += 5
    strengths.push("Emojis présents")
  } else {
    improvements.push("Ajoute 1-3 emojis pour attirer l'œil")
  }
  if (/\n/.test(text)) {
    total += 8
    strengths.push("Texte aéré (paragraphes)")
  } else {
    improvements.push("Aère le texte avec des sauts de ligne")
  }
  if (/[-•▸]/.test(text)) {
    total += 7
    strengths.push("Listes ou tirets présents")
  } else {
    improvements.push("Utilise des tirets ou puces")
  }

  // 4. CTA — 200 derniers caractères (20 pts max)
  const ending = text.slice(-200)
  if (/\?/.test(ending)) {
    total += 10
    strengths.push("Question finale (appel à l'action)")
  } else {
    improvements.push("Termine par une question engageante")
  }
  if (/commentaire|avis|pensez|dites/i.test(ending)) {
    total += 10
    strengths.push("Invitation à commenter")
  } else {
    improvements.push("Invite à commenter ('votre avis ?')")
  }

  // 5. Mots viraux (15 pts)
  const viralWords = [
    "secret", "erreur", "vérité", "jamais", "toujours",
    "enfin", "révèle", "gratuit", "résultat", "concret",
  ]
  const matchCount = viralWords.filter((w) => text.toLowerCase().includes(w)).length
  if (matchCount >= 3) {
    total += 15
    strengths.push(`${matchCount} mots viraux détectés`)
  } else if (matchCount >= 1) {
    total += 8
    strengths.push(`${matchCount} mot${matchCount > 1 ? "s" : ""} viral détecté`)
  } else {
    improvements.push("Ajoute des mots viraux (erreur, résultat…)")
  }

  return { total: Math.min(Math.max(total, 45), 100), strengths, improvements }
}

/* ─── Helpers visuels ───────────────────────────────────────── */

function getColor(score: number) {
  if (score <= 55) return "#ef4444"
  if (score <= 72) return "#f97316"
  if (score <= 85) return "#3b82f6"
  return "#22c55e"
}

function getLabel(score: number) {
  if (score <= 55) return "Peut mieux faire"
  if (score <= 72) return "Bon post"
  if (score <= 85) return "Très bon post ⭐"
  return "Post viral 🔥"
}

const RADIUS = 38
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/* ─── Composant ─────────────────────────────────────────────── */

export default function PostScore({ text }: { text: string }) {
  const result = useMemo(() => computeScore(text), [text])
  const [displayScore, setDisplayScore] = useState(0)

  // Animation de la jauge en 1 seconde (ease-out cubic)
  useEffect(() => {
    const target = result.total
    if (target === 0) { setDisplayScore(0); return }

    setDisplayScore(0)
    const startTime = performance.now()
    const duration = 900

    function step(now: number) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplayScore(Math.round(target * eased))
      if (t < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [result.total])

  const color = getColor(result.total)
  const dashOffset = CIRCUMFERENCE * (1 - displayScore / 100)

  const topStrengths = result.strengths.slice(0, 3)
  const topImprovements = result.improvements.slice(0, 3)

  return (
    <div className="flex flex-col items-center gap-3 pt-1">
      {/* Jauge circulaire */}
      <div className="relative shrink-0">
        <svg width="120" height="120" viewBox="0 0 100 100">
          {/* Piste fond */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Arc progression */}
          <circle
            cx="50" cy="50" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.3s ease" }}
          />
        </svg>
        {/* Score centré */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black leading-none" style={{ color }}>
            {displayScore}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      <span className="text-xs font-bold tracking-wide" style={{ color }}>
        {getLabel(result.total)}
      </span>

      {/* Divider */}
      <div className="w-full border-t border-slate-100 dark:border-slate-700" />

      {/* Points forts */}
      {topStrengths.length > 0 && (
        <div className="w-full space-y-1.5">
          {topStrengths.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-600 dark:text-slate-400">
              <span className="shrink-0">✅</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Points à améliorer */}
      {topImprovements.length > 0 && (
        <div className="w-full space-y-1.5">
          {topImprovements.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] leading-snug text-slate-400 dark:text-slate-500">
              <span className="shrink-0">💡</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
