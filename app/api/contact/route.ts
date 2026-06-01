import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  subject: z.enum(['commande', 'produit', 'livraison', 'autre']),
  message: z.string().min(20),
})

const subjectLabels: Record<string, string> = {
  commande: 'Commande',
  produit: 'Produit',
  livraison: 'Livraison',
  autre: 'Autre',
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as unknown
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, subject, message } = parsed.data

    const resend = new Resend(process.env.RESEND_API_KEY ?? '')
    const adminEmail = process.env.ADMIN_EMAIL ?? 'contact@ritualglowry.ma'
    const fromEmail = process.env.EMAIL_FROM ?? 'Ritual Glowry <noreply@ritualglowry.ma>'

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `[Contact] ${subjectLabels[subject]} — ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FAF6EF;">
          <h1 style="font-family: Georgia, serif; font-style: italic; color: #3D2B1F; font-size: 24px; margin-bottom: 24px;">
            Nouveau message de contact
          </h1>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #3D2B1F; font-weight: 600; width: 120px;">Nom :</td>
              <td style="padding: 8px 0; color: #3D2B1F;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #3D2B1F; font-weight: 600;">Email :</td>
              <td style="padding: 8px 0; color: #3D2B1F;">
                <a href="mailto:${email}" style="color: #C9A875;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #3D2B1F; font-weight: 600;">Sujet :</td>
              <td style="padding: 8px 0; color: #3D2B1F;">${subjectLabels[subject]}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #F5EDE0; border-left: 4px solid #C9A875;">
            <p style="color: #3D2B1F; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #3D2B1F; font-size: 12px; margin-top: 24px; opacity: 0.6;">
            Message reçu le ${new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Contact API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
