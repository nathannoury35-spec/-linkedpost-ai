export async function register() {
  if (process.env.NODE_ENV === "development") {
    // Contournement SSL sur Windows (certificat intermédiaire non reconnu par Node)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

    // Vérification des clés critiques au démarrage
    const checks: [string, string | undefined][] = [
      ["NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL],
      ["NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
      ["OPENAI_API_KEY", process.env.OPENAI_API_KEY],
    ]

    console.log("\n─── LinkedPost AI — Variables d'environnement ───")
    for (const [key, value] of checks) {
      const status = value ? `✓ définie (${value.slice(0, 8)}…)` : "✗ MANQUANTE"
      console.log(`  ${key}: ${status}`)
    }
    console.log("─────────────────────────────────────────────────\n")
  }
}
