"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"

/* ─── Types & données ───────────────────────────────────────── */

type Category = "Chiffres" | "Question" | "Storytelling" | "Controverse" | "Curiosité"

type Hook = {
  id: number
  text: string
  category: Category
}

const HOOKS: Hook[] = [
  // Chiffres
  { id: 1,  category: "Chiffres",     text: "X% des freelances abandonnent dans la première année. Voici pourquoi je ne serai pas dans cette statistique." },
  { id: 2,  category: "Chiffres",     text: "J'ai envoyé 47 propositions. 2 réponses. Voici ce que j'ai changé." },
  { id: 3,  category: "Chiffres",     text: "En 90 jours, j'ai triplé mon TJM. La méthode étape par étape." },
  { id: 4,  category: "Chiffres",     text: "3 clients. 0 démarchage. Voici comment." },
  // Question
  { id: 5,  category: "Question",     text: "Et si votre plus grand frein n'était pas le manque de clients, mais le manque de clarté ?" },
  { id: 6,  category: "Question",     text: "Pourquoi les meilleurs freelances refusent des missions bien payées ?" },
  { id: 7,  category: "Question",     text: "Vous facturez combien de l'heure ? (Et pourquoi cette question est piège)" },
  { id: 8,  category: "Question",     text: "Qu'est-ce qui différencie un freelance à 300€/j d'un freelance à 800€/j ?" },
  // Storytelling
  { id: 9,  category: "Storytelling", text: "Il y a 18 mois, j'étais en CDI avec un salaire fixe. Aujourd'hui je gagne 2x plus. Ce qui a tout changé :" },
  { id: 10, category: "Storytelling", text: "Mon premier client m'a dit non. Mon deuxième aussi. Le troisième a changé ma vie." },
  { id: 11, category: "Storytelling", text: "J'ai failli tout arrêter en novembre dernier. Voici ce qui m'a sauvé." },
  { id: 12, category: "Storytelling", text: "Le jour où j'ai réalisé que je vendais mon temps, pas ma valeur." },
  // Controverse
  { id: 13, category: "Controverse",  text: "Le networking est surévalué. Voilà ce qui marche vraiment." },
  { id: 14, category: "Controverse",  text: "Arrêtez de baisser vos tarifs. C'est le pire conseil qu'on puisse vous donner." },
  { id: 15, category: "Controverse",  text: "LinkedIn ne sert à rien si vous faites ça." },
  { id: 16, category: "Controverse",  text: "La plupart des conseils sur le freelancing sont faux." },
  // Curiosité
  { id: 17, category: "Curiosité",    text: "Ce que personne ne vous dit sur la vie de freelance." },
  { id: 18, category: "Curiosité",    text: "La technique que j'utilise pour ne jamais manquer de clients (et que 95% ignorent)." },
  { id: 19, category: "Curiosité",    text: "J'ai analysé 200 posts LinkedIn viraux. Voici le pattern." },
  { id: 20, category: "Curiosité",    text: "Le secret des freelances qui gagnent bien sans travailler plus." },
]

const CATEGORIES: ("Tous" | Category)[] = [
  "Tous", "Chiffres", "Question", "Storytelling", "Controverse", "Curiosité",
]

const CATEGORY_STYLES: Record<Category, { badge: string }> = {
  Chiffres:     { badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  Question:     { badge: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  Storytelling: { badge: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  Controverse:  { badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  Curiosité:    { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function HooksPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<"Tous" | Category>("Tous")
  const [search, setSearch] = useState("")
  const [usedId, setUsedId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return HOOKS.filter((h) => {
      const matchCat = activeCategory === "Tous" || h.category === activeCategory
      const matchSearch = !q || h.text.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  function handleUse(hook: Hook) {
    setUsedId(hook.id)
    router.push("/generate?hook=" + encodeURIComponent(hook.text))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Bibliothèque de hooks viraux
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Les premières phrases qui font tout — choisissez-en un pour démarrer votre post.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un hook…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
              activeCategory === cat
                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Compteur */}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        {filtered.length} hook{filtered.length > 1 ? "s" : ""}
        {activeCategory !== "Tous" ? ` · ${activeCategory}` : ""}
        {search ? ` · "${search}"` : ""}
      </p>

      {/* Grille de hooks */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((hook) => (
            <div
              key={hook.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all"
            >
              {/* Badge catégorie */}
              <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_STYLES[hook.category].badge}`}>
                {hook.category}
              </span>

              {/* Texte du hook */}
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed flex-1">
                &ldquo;{hook.text}&rdquo;
              </p>

              {/* Bouton */}
              <button
                onClick={() => handleUse(hook)}
                className={`self-start flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  usedId === hook.id
                    ? "bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                    : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 shadow-sm shadow-blue-500/20"
                }`}
              >
                {usedId === hook.id ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sélectionné !
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Utiliser ce hook
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="font-semibold text-slate-600 dark:text-slate-400">Aucun hook trouvé</p>
          <p className="text-sm text-slate-400 mt-1">Essayez un autre terme ou une autre catégorie.</p>
        </div>
      )}
    </div>
  )
}
