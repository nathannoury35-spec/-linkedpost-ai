import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const fullName = user.user_metadata?.full_name as string | undefined
  const firstName = fullName?.split(" ")[0] ?? "là"

  const stats = [
    { label: "Posts générés", value: "0", icon: "⚡", color: "from-blue-500 to-indigo-600" },
    { label: "Posts restants", value: "3", icon: "🎯", color: "from-violet-500 to-purple-600" },
    { label: "Plan actuel", value: "Gratuit", icon: "🚀", color: "from-slate-500 to-slate-700" },
  ]

  const quickActions = [
    {
      href: "/generate",
      title: "Générer un post",
      description: "Créez un nouveau post LinkedIn en 30 secondes grâce à l'IA.",
      icon: "⚡",
      cta: "Générer maintenant",
      primary: true,
    },
    {
      href: "/history",
      title: "Voir l'historique",
      description: "Retrouvez tous vos posts générés et copiez vos meilleurs formats.",
      icon: "📋",
      cta: "Voir l'historique",
      primary: false,
    },
    {
      href: "/billing",
      title: "Passer au Pro",
      description: "100 posts / mois, tous les tons, calendrier de contenu pour 29€/mois.",
      icon: "🚀",
      cta: "Voir les offres",
      primary: false,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Prêt à créer du contenu qui engage votre audience LinkedIn ?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl flex-shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <div key={action.href} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col">
              <span className="text-2xl mb-3">{action.icon}</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{action.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 mb-4">{action.description}</p>
              <Link
                href={action.href}
                className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-all ${
                  action.primary
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90"
                    : "border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {action.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Getting started banner */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-lg mb-1">Commencez dès maintenant</p>
          <p className="text-blue-200 text-sm">Vous avez 3 posts gratuits. Générez votre premier post LinkedIn en 30 secondes.</p>
        </div>
        <Link
          href="/generate"
          className="flex-shrink-0 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors"
        >
          ⚡ Générer un post
        </Link>
      </div>
    </div>
  )
}
