"use client"

import { useState } from "react"

export function PlanCheckoutButton({
  priceId,
  label,
  className,
  fallbackHref,
}: {
  priceId: string
  label: string
  className: string
  fallbackHref?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })
      if (res.status === 401) {
        window.location.href = fallbackHref ?? "/register"
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? "Erreur lors du paiement")
        setLoading(false)
      }
    } catch {
      setError("Erreur réseau, réessayez.")
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? "Redirection…" : label}
      </button>
      {error && <p className="text-xs text-red-500 mt-1.5 text-center">{error}</p>}
    </div>
  )
}
