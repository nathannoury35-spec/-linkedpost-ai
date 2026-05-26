import Link from "next/link"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-base">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white font-black text-sm">
              L
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              LinkedPost AI
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Mon compte →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span>© 2026 LinkedPost AI. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <Link href="/confidentialite" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              CGU
            </Link>
            <Link href="/contact" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
