import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { isTokenVerified } from '@/lib/verification'

export const runtime = 'nodejs'

// SMTP-Transporter konfigurieren
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true für 465, false für andere Ports
  auth: {
    user: process.env.SMTP_USER || 'info@kreditheld24.de',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
  }
})

function toString(value: unknown) {
  return value == null ? '' : String(value)
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const verificationToken = form.get('verificationToken')?.toString()
    const email = form.get('email')?.toString()

    // Server-seitige Durchsetzung: E-Mail muss verifiziert sein
    if (!verificationToken || !(await isTokenVerified(verificationToken))) {
      return NextResponse.json({ error: 'E-Mail nicht verifiziert' }, { status: 403 })
    }

    if (!email) {
      return NextResponse.json({ error: 'E-Mail fehlt' }, { status: 400 })
    }

    // Relevante Felder extrahieren
    const fields = [
      // Persönlich
      'anrede','vorname','nachname','geburtsdatum','familienstand','staatsangehoerigkeit','telefon','email',
      // Adresse
      'strasse','hausnummer','plz','ort',
      // Kreditwunsch
      'produktKategorie','kreditart','kreditsumme','laufzeit','gewuenschteRate','verwendungszweck',
      'baufinanzierungArt','kaufpreisBaukosten','eigenkapital',
      // Einkommen
      'beschaeftigungsverhaeltnis','nettoEinkommen','beschaeftigtSeit',
      // Ausgaben
      'miete','sonstigeAusgaben','bestehendeDarlehen',
      // Sonstiges
      'bemerkungen','datenschutz','newsletter'
    ]
    const data: Record<string,string> = {}
    for (const key of fields) {
      const val = form.get(key)
      data[key] = toString(val)
    }

    // Anhänge aus Datei-Feldern erstellen
    const fileFieldNames = [
      'gehaltsabrechnung1',
      'gehaltsabrechnung2',
      'personalausweisVorderseite',
      'personalausweisRueckseite',
      'bestehendeKredite',
      'kontoauszug'
    ]

    const attachments: Array<{ filename: string; content: Buffer; contentType?: string }> = []
    for (const field of fileFieldNames) {
      const file = form.get(field) as File | null
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        if (buffer.length > 0) {
          attachments.push({
            filename: file.name || `${field}.dat`,
            content: buffer,
            contentType: (file as any).type || undefined
          })
        }
      }
    }

    // HTML-E-Mail-Inhalt
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Neue Kreditanfrage</title>
      </head>
      <body style="font-family: Arial, sans-serif; color:#111; line-height:1.5;">
        <div style="background:#0ea5e9; padding:20px; color:#fff;">
          <h2 style="margin:0;">Kreditheld24 – Neue Kreditanfrage</h2>
        </div>
        <div style="padding:20px; border:1px solid #e5e7eb; border-top:none;">
          <h3 style="color:#16a34a; margin-top:0;">Kundendaten</h3>
          <p>
            <strong>Name:</strong> ${data.anrede} ${data.vorname} ${data.nachname}<br/>
            <strong>Geburtsdatum:</strong> ${data.geburtsdatum}<br/>
            <strong>Familienstand:</strong> ${data.familienstand}<br/>
            <strong>Staatsangehörigkeit:</strong> ${data.staatsangehoerigkeit}<br/>
            <strong>E-Mail:</strong> ${email}<br/>
            <strong>Telefon:</strong> ${data.telefon}<br/>
            <strong>Adresse:</strong> ${data.strasse} ${data.hausnummer}, ${data.plz} ${data.ort}
          </p>

          <h3 style="color:#16a34a;">Kreditwunsch</h3>
          <p>
            <strong>Kategorie:</strong> ${data.produktKategorie === 'baufinanzierung' ? 'Baufinanzierung' : 'Privatkredit'}<br/>
            ${data.produktKategorie === 'baufinanzierung'
              ? `
                <strong>Art der Baufinanzierung:</strong> ${data.baufinanzierungArt}<br/>
                <strong>Kaufpreis/Baukosten:</strong> ${data.kaufpreisBaukosten} €<br/>
                <strong>Eigenkapital:</strong> ${data.eigenkapital} €
              `
              : `
                <strong>Kreditart:</strong> ${data.kreditart}<br/>
                <strong>Kreditsumme:</strong> ${data.kreditsumme} €<br/>
                <strong>Laufzeit:</strong> ${data.laufzeit} Monate<br/>
                <strong>Gewünschte Rate:</strong> ${data.gewuenschteRate} €<br/>
                <strong>Verwendungszweck:</strong> ${data.verwendungszweck}
              `
            }
          </p>

          <h3 style="color:#16a34a;">Beschäftigung</h3>
          <p>
            <strong>Verhältnis:</strong> ${data.beschaeftigungsverhaeltnis}<br/>
            <strong>Netto-Einkommen:</strong> ${data.nettoEinkommen} €<br/>
            <strong>Beschäftigt seit:</strong> ${data.beschaeftigtSeit}
          </p>

          <h3 style="color:#16a34a;">Finanzen</h3>
          <p>
            <strong>Miete:</strong> ${data.miete} €<br/>
            <strong>Sonstige Ausgaben:</strong> ${data.sonstigeAusgaben} €<br/>
            <strong>Bestehende Darlehen:</strong> ${data.bestehendeDarlehen}
          </p>

          <h3 style="color:#16a34a;">Hinweise</h3>
          <p>
            <strong>Newsletter:</strong> ${data.newsletter === 'true' ? 'Ja' : 'Nein'}<br/>
            <strong>Datenschutz:</strong> ${data.datenschutz === 'true' ? 'Zugestimmt' : 'Nicht zugestimmt'}
          </p>

          ${data.bemerkungen ? `<h3 style="color:#16a34a;">Bemerkungen</h3><p>${data.bemerkungen}</p>` : ''}

          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />
          <p style="font-size:12px; color:#6b7280;">
            Diese Anfrage wurde über das Formular auf der Website eingereicht.
          </p>
        </div>
      </body>
      </html>
    `

    const subject = data.produktKategorie === 'baufinanzierung'
      ? `Neue Baufinanzierungsanfrage von ${data.vorname} ${data.nachname}`
      : `Neue Kreditanfrage von ${data.vorname} ${data.nachname} – ${data.kreditsumme}€`

    const mailOptions = {
      from: {
        name: 'Kreditheld24',
        address: process.env.SMTP_USER || 'info@kreditheld24.de'
      },
      to: 'info@kreditheld24.de',
      replyTo: email,
      subject: subject,
      html,
      attachments
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: 'Kreditanfrage gesendet' })
  } catch (error) {
    console.error('Fehler bei der Kreditanfrage:', error)
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 })
  }
}