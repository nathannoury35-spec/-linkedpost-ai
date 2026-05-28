import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white text-sm font-black">
                L
              </span>
              <span className="text-white">LinkedPost AI</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Générez des posts LinkedIn professionnels et engageants en quelques secondes grâce à l&apos;intelligence artificielle.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Essai gratuit</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link href="/cgu" className="hover:text-white transition-colors">CGU</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} LinkedPost AI. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec
            <span className="text-red-400">♥</span>
            pour les freelances
          </p>
        </div>
      </div>
    </footer>
  )
}
