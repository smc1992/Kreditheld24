import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createKundenangabenCase } from '../../../../lib/europace'

export const runtime = 'nodejs'

type ContactPayload = {
  salutation?: 'herr' | 'frau' | 'divers'
  firstname: string
  lastname: string
  email: string
  phone?: string
  subject: string
  message: string
  privacy?: boolean
}

function renderHtml(data: ContactPayload) {
  const fullName = `${data.firstname} ${data.lastname}`.trim()
  const salutation = data.salutation ? data.salutation : 'herr'
  const subjectMap: Record<string, string> = {
    'allgemeine-anfrage': 'Allgemeine Anfrage',
    kreditanfrage: 'Kreditanfrage',
    beratungstermin: 'Beratungstermin vereinbaren',
    beschwerde: 'Beschwerde',
    sonstiges: 'Sonstiges'
  }
  const subjectLabel = subjectMap[data.subject] || data.subject

  return `
  <!doctype html>
  <html lang="de">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Neue Kontaktanfrage</title>
      <style>
        body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background:#f7f7f7; color:#111827; }
        .container { max-width: 640px; margin: 24px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #16a34a, #15803d); color:#fff; padding: 20px 24px; }
        .badge { display:inline-block; background: rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); padding:6px 10px; border-radius:9999px; font-size:12px; }
        .content { padding: 24px; }
        .row { margin: 0 0 16px; }
        .label { font-size:12px; color:#6b7280; text-transform:uppercase; letter-spacing:.02em; }
        .value { font-size:16px; color:#111827; margin-top:4px; }
        .message { white-space: pre-wrap; border:1px solid #e5e7eb; background:#fafafa; padding:14px; border-radius:10px; }
        .footer { padding: 16px 24px; color:#6b7280; font-size:12px; }
        .cta { display:inline-block; margin-top:10px; padding:10px 14px; color:#ffffff; background:#16a34a; border-radius:8px; text-decoration:none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">Kreditheld24 – Neue Kontaktanfrage</div>
          <h2 style="margin:10px 0 0; font-weight:700;">${subjectLabel}</h2>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">Name</div>
            <div class="value">${salutation === 'frau' ? 'Frau' : salutation === 'divers' ? 'Divers' : 'Herr'} ${fullName}</div>
          </div>
          <div class="row">
            <div class="label">E-Mail</div>
            <div class="value">${data.email}</div>
          </div>
          ${data.phone ? `<div class="row"><div class="label">Telefon</div><div class="value">${data.phone}</div></div>` : ''}
          <div class="row">
            <div class="label">Betreff</div>
            <div class="value">${subjectLabel}</div>
          </div>
          <div class="row">
            <div class="label">Nachricht</div>
            <div class="message">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </div>

          <a class="cta" href="mailto:${data.email}?subject=Re: ${encodeURIComponent(subjectLabel)}">Jetzt antworten</a>
        </div>
        <div class="footer">
          Diese Nachricht wurde automatisch vom Kontaktformular der Website gesendet.
        </div>
      </div>
    </body>
  </html>
  `
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as ContactPayload

    if (!data || !data.firstname || !data.lastname || !data.email || !data.message) {
      return NextResponse.json({ error: 'Ungültige Anfrage – Pflichtfelder fehlen' }, { status: 400 })
    }

    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER || 'info@kreditheld24.de',
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
      }
    })

    const toAddress = 'info@kreditheld24.de'

    const mailOptions = {
      from: process.env.SMTP_USER || 'info@kreditheld24.de',
      to: toAddress,
      replyTo: data.email,
      subject: `Kontaktanfrage: ${data.firstname} ${data.lastname} – ${data.subject}`,
      html: renderHtml(data),
      text: `Kontaktanfrage von ${data.firstname} ${data.lastname}\nE-Mail: ${data.email}\nTelefon: ${data.phone || '-'}\nBetreff: ${data.subject}\n\nNachricht:\n${data.message}`
    }

    let emailSent = false
    try {
      await transporter.sendMail(mailOptions)
      emailSent = true
    } catch (mailError) {
      console.error('Fehler beim Senden der Kontakt-E-Mail (SMTP):', mailError)
      // Kein 500 mehr: wir geben Erfolg mit Hinweis zurück, sodass das Frontend nicht bricht
    }

    // Europace-Weiterleitung nur bei Betreff "kreditanfrage"
    let europaceForwarded = false
    let europaceInfo: { vorgangsNummer?: string; openUrl?: string } | undefined

    if ((data.subject || '').toLowerCase() === 'kreditanfrage') {
      try {
        const datenkontext = process.env.EUROPACE_DATENKONTEXT === 'ECHT_GESCHAEFT' ? 'ECHT_GESCHAEFT' : 'TEST_MODUS'
        const salutMap: Record<string, string> = { herr: 'HERR', frau: 'FRAU', divers: 'DIVERS' }

        const payload = {
          importMetadaten: {
            datenkontext,
            externeVorgangsId: `contact-${Date.now()}`,
            importquelle: 'Kontaktformular Kreditheld24',
          },
          kundenangaben: {
            haushalte: [
              {
                kunden: [
                  {
                    externeKundenId: data.email,
                    personendaten: {
                      person: {
                        anrede: salutMap[(data.salutation || 'herr').toLowerCase()],
                        vorname: data.firstname,
                        nachname: data.lastname,
                      },
                    },
                    kontakt: {
                      telefonnummer: data.phone ? { nummer: data.phone } : undefined,
                      email: data.email,
                    },
                  },
                ],
              },
            ],
            // Darlehenswunsch optional – wird später im Europace-Prozess ergänzt
          },
        }

        const created = await createKundenangabenCase(payload, datenkontext as any)
        europaceForwarded = true
        europaceInfo = { vorgangsNummer: created.vorgangsNummer, openUrl: created.openUrl }
      } catch (apiErr) {
        console.error('Europace Weiterleitung fehlgeschlagen:', apiErr)
      }
    }

    return NextResponse.json({ success: true, emailSent, europaceForwarded, europace: europaceInfo })
  } catch (error) {
    console.error('Fehler beim Senden der Kontakt-E-Mail:', error)
    return NextResponse.json({ error: 'Fehler beim Senden der E-Mail' }, { status: 500 })
  }
}