import { createAdminClient } from "@/lib/supabase/admin"
import { resend } from "@/lib/resend/client"

function padTime(t: number) {
  return String(t).padStart(2, "0")
}

function buildEmailHtml(content: string, time: string): string {
  const [h, m] = time.split(":")
  const label = `${parseInt(h)}h${m}`
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1e293b;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 22px; font-weight: 800; background: linear-gradient(135deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          LinkedPost AI
        </span>
      </div>

      <p style="font-size: 16px; margin-bottom: 8px;">Bonjour,</p>
      <p style="font-size: 16px; color: #475569; margin-bottom: 24px;">
        Vous avez planifié un post LinkedIn aujourd'hui à <strong>${label}</strong>.
      </p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="font-size: 13px; color: #94a3b8; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
          Votre post
        </p>
        <p style="font-size: 15px; color: #1e293b; line-height: 1.7; white-space: pre-wrap; margin: 0;">${content}</p>
      </div>

      <a href="https://www.linkedin.com/feed/" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; margin-bottom: 24px;">
        👉 Publier sur LinkedIn maintenant
      </a>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 32px;">
        <p style="margin: 0; font-size: 14px; color: #1d4ed8;">
          💡 <strong>Conseil :</strong> Les posts publiés à ${label} ont en moyenne <strong>2× plus d'engagement</strong>. C'est le bon moment !
        </p>
      </div>

      <p style="font-size: 14px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin: 0;">
        — L'équipe LinkedPost AI<br>
        <span style="font-size: 12px;">Pour ne plus recevoir ces rappels, modifiez vos préférences dans le calendrier.</span>
      </p>
    </div>
  `
}

export async function GET() {
  const supabase = createAdminClient()

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${padTime(now.getMonth() + 1)}-${padTime(now.getDate())}`
  const nowTime = `${padTime(now.getHours())}:${padTime(now.getMinutes())}:00`
  const plusOneHour = new Date(now.getTime() + 60 * 60 * 1000)
  const plusOneHourTime = `${padTime(plusOneHour.getHours())}:${padTime(plusOneHour.getMinutes())}:00`

  const { data: posts, error } = await supabase
    .from("scheduled_posts")
    .select("id, content, scheduled_time, user_id")
    .eq("scheduled_date", todayStr)
    .gte("scheduled_time", nowTime)
    .lte("scheduled_time", plusOneHourTime)
    .eq("status", "scheduled")
    .eq("email_reminder", true)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (!posts || posts.length === 0) {
    return Response.json({ sent: 0 })
  }

  const userIds = [...new Set(posts.map(p => p.user_id))]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email")
    .in("id", userIds)

  const emailByUserId: Record<string, string> = {}
  for (const p of profiles ?? []) emailByUserId[p.id] = p.email

  let sent = 0
  const ids: string[] = []

  for (const post of posts) {
    const email = emailByUserId[post.user_id]
    if (!email) continue

    try {
      await resend.emails.send({
        from: "LinkedPost AI <rappels@linkedpost.ai>",
        to: email,
        subject: "📅 Rappel : Votre post LinkedIn est prêt à publier",
        html: buildEmailHtml(post.content, post.scheduled_time),
      })
      ids.push(post.id)
      sent++
    } catch {
      // Échec silencieux — on continue pour les autres
    }
  }

  if (ids.length > 0) {
    await supabase
      .from("scheduled_posts")
      .update({ status: "reminded" })
      .in("id", ids)
  }

  return Response.json({ sent })
}
