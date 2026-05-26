"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white text-sm font-black">
            L
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            LinkedPost AI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-slate-900 transition-colors">Fonctionnalités</Link>
          <Link href="#pricing" className="hover:text-slate-900 transition-colors">Tarifs</Link>
          <Link href="#testimonials" className="hover:text-slate-900 transition-colors">Témoignages</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-opacity shadow-sm"
          >
            Essayer gratuitement
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3 border-t border-slate-100 bg-white text-sm font-medium">
          <Link href="#features" onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-900">Fonctionnalités</Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-900">Tarifs</Link>
          <Link href="#testimonials" onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-900">Témoignages</Link>
          <hr className="border-slate-100" />
          <Link href="/login" className="text-slate-600">Connexion</Link>
          <Link href="/register" className="px-4 py-2 text-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold">
            Essayer gratuitement
          </Link>
        </div>
      )}
    </header>
  )
}
