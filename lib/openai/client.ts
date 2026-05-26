import OpenAI from "openai"

// Factory plutôt que singleton — lit process.env au moment de l'appel,
// pas au chargement du module. Évite de cacher une clé vide au démarrage.
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY est manquante dans .env.local. " +
      "Ajoutez votre clé et redémarrez le serveur."
    )
  }

  return new OpenAI({ apiKey })
}
