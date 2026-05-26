import { resend } from "@/lib/resend/client"

export async function POST(request: Request) {
  let body: { name: string; email: string; subject: string; message: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Corps invalide" }, { status: 400 })
  }

  const { name, email, subject, message } = body
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: "Champs manquants" }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: "LinkedPost AI <noreply@linkedpost-ai.com>",
      to: "contact@linkedpost-ai.com",
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1e293b;">
          <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 800;">Nouveau message de contact</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 100px;">Nom</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td><td style="padding: 8px 0; font-weight: 600;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;">Sujet</td><td style="padding: 8px 0; font-weight: 600;">${subject}</td></tr>
          </table>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
            <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    })
    return Response.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur Resend"
    return Response.json({ error: msg }, { status: 500 })
  }
}
