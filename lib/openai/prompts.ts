export type Tone = "professional" | "inspirational" | "storytelling" | "educational" | "casual"
export type Format = "short" | "medium" | "long"

const TARGET_WORDS: Record<Format, number> = {
  short: 150,
  medium: 300,
  long: 500,
}

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  professional:
    "Ton professionnel et expert. Appuie-toi sur des faits, des chiffres ou des observations concrètes. Style direct, autoritaire mais accessible. Évite les formules creuses. L'objectif est d'inspirer confiance et de démontrer l'expertise.",

  inspirational:
    "Ton inspirant et motivant. Commence par une affirmation forte ou une vérité contre-intuitive. Utilise des contrastes (avant/après, rêve/réalité). Génère de l'émotion positive. L'objectif est de motiver le lecteur à passer à l'action.",

  storytelling:
    "Ton narratif et personnel. Raconte une histoire vraie ou plausible avec une structure claire : situation initiale → problème → décision → transformation → leçon. Utilise la 1ère personne (je). L'accroche doit mettre en scène un moment précis.",

  educational:
    "Ton pédagogique et pratique. Partage un enseignement structuré (liste numérotée, étapes, framework). Chaque point doit être actionnable. Commence par poser le problème que le lecteur a déjà vécu. L'objectif est d'apporter une valeur immédiate.",

  casual:
    "Ton décontracté et authentique. Style conversationnel, comme si tu parlais à un ami professionnel. Peut inclure une touche d'humour subtil ou d'autodérision. Phrases courtes, naturelles. Évite le jargon corporate. L'objectif est de paraître humain et accessible.",
}

const TONE_LABELS: Record<Tone, string> = {
  professional: "Professionnel",
  inspirational: "Inspirant",
  storytelling: "Storytelling",
  educational: "Éducatif",
  casual: "Décontracté",
}

export const SYSTEM_PROMPT = `Tu es un expert en content marketing LinkedIn pour les freelances et consultants francophones. Tu maîtrises parfaitement les codes de ce réseau et tu crées des posts qui génèrent de l'engagement organique.

Règles impératives pour chaque post :
1. ACCROCHE : La première ligne doit être irrésistible — question provocante, chiffre surprenant, affirmation audacieuse, ou début d'histoire. Elle doit donner envie de cliquer "voir plus".
2. STRUCTURE : Espaces entre les paragraphes (max 3-4 lignes par bloc). LinkedIn n'est pas un blog.
3. EMOJIS : Maximum 3, bien placés, jamais en début de phrase. Jamais 🚀 seul.
4. HASHTAGS : 3 à 5 hashtags pertinents en fin de post, sur une ligne séparée.
5. CTA : Termine toujours par une question ou une invitation à l'interaction naturelle.
6. LANGUE : Français soigné mais naturel. Pas de "En tant que [métier]," ni "Dans ce post je vais vous parler de".
7. FORMAT : Retourne UNIQUEMENT le post LinkedIn, sans introduction, sans "Voici le post :", sans guillemets autour.`

export function buildUserPrompt(params: {
  jobTitle: string
  topic: string
  tone: Tone
  format: Format
}): string {
  const { jobTitle, topic, tone, format } = params
  const targetWords = TARGET_WORDS[format]
  const toneLabel = TONE_LABELS[tone]
  const toneInstructions = TONE_INSTRUCTIONS[tone]

  return `Crée un post LinkedIn de ${targetWords} mots (±10%) pour un ${jobTitle} sur le sujet suivant : "${topic}".

TON : ${toneLabel}
${toneInstructions}

Objectif de longueur : environ ${targetWords} mots.
N'oublie pas les hashtags et le CTA final.`
}
