import { createClient } from "@/lib/supabase/server"
import { getOpenAIClient } from "@/lib/openai/client"
import { SYSTEM_PROMPT, buildUserPrompt, type Tone, type Format } from "@/lib/openai/prompts"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Corps de la requête invalide" }, { status: 400 })
  }

  const { topic, tone, format, metier, secteur, clients_cibles } = body

  if (!topic || !tone) {
    return Response.json({ error: "Les champs topic et tone sont requis" }, { status: 400 })
  }

  // Vérifier la limite de générations
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, generations_used, generations_limit")
    .eq("id", user.id)
    .single()

  if (profile && profile.generations_used >= profile.generations_limit) {
    return Response.json(
      { error: "limit_reached", plan: profile.role ?? "free" },
      { status: 403 }
    )
  }

  let systemPrompt = SYSTEM_PROMPT
  if (metier || secteur || clients_cibles) {
    systemPrompt += `\n\nContexte personnel : Tu génères un post LinkedIn pour ${metier || "un professionnel"} qui cible ${clients_cibles || "des clients"} dans le secteur ${secteur || "professionnel"}. Style d'écriture : ${tone}. Le post doit sonner authentique et personnel, pas comme du contenu généré par IA.`
  }

  try {
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: buildUserPrompt({
            jobTitle: metier || "professionnel",
            topic,
            tone: tone as Tone,
            format: (format as Format) || "medium",
          }),
        },
      ],
      max_tokens: 900,
      temperature: 0.82,
    })

    const post = completion.choices[0]?.message?.content?.trim() ?? ""

    if (!post) {
      return Response.json({ error: "La génération a échoué, réessayez." }, { status: 500 })
    }

    // Incrémenter le compteur
    if (profile) {
      await supabase
        .from("profiles")
        .update({ generations_used: profile.generations_used + 1 })
        .eq("id", user.id)
    }

    return Response.json({ post })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur OpenAI inconnue"
    return Response.json({ error: msg }, { status: 500 })
  }
}
