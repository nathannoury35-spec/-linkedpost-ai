"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const choice = localStorage.getItem("cookies_accepted")
      if (choice === null) setVisible(true)
    } catch {
      // localStorage inaccessible (SSR, iframe, mode privé strict)
    }
  }, [])

  function accept() {
    localStorage.setItem("cookies_accepted", "true")
    setVisible(false)
  }

  function refuse() {
    localStorage.setItem("cookies_accepted", "false")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-slate-800 dark:bg-slate-850 border border-slate-700 dark:border-slate-600 rounded-2xl shadow-2xl shadow-black/30 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-lg flex-shrink-0 mt-0.5">🍪</span>
          <p className="text-sm text-slate-300 leading-relaxed">
            Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre{" "}
            <Link href="/confidentialite" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={refuse}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 border border-slate-600 hover:border-slate-500 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
