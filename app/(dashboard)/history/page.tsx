import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import HistoryList from "@/components/dashboard/HistoryList"

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, content, tone, format, topic, job_title, word_count, saved, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Mes posts sauvegardés</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {posts?.length
              ? `${posts.length} post${posts.length > 1 ? "s" : ""} dans votre bibliothèque`
              : "Votre bibliothèque de posts LinkedIn"}
          </p>
        </div>
        <Link
          href="/generate"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Générer un post
        </Link>
      </div>

      {/* Erreur Supabase */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          Impossible de charger l&apos;historique : {error.message}
        </div>
      )}

      {/* Liste */}
      <HistoryList posts={posts ?? []} />
    </div>
  )
}
