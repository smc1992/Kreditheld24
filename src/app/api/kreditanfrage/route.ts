import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { isTokenVerified } from '../../../lib/verification'

export const runtime = 'nodejs'

// SMTP-Transporter konfigurieren
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  secure: smtpPort === 465, // SSL nur bei 465
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
      'anrede','vorname','nachname','geburtsdatum','geburtsort','familienstand','staatsangehoerigkeit','telefon','email',
      // Adresse
      'strasse','hausnummer','plz','ort',
      // Kreditwunsch
      'produktKategorie','kreditart','kreditsumme','laufzeit','gewuenschteRate','verwendungszweck',
      'baufinanzierungArt','kaufpreisBaukosten','eigenkapital',
      // Sonstiges
      'bemerkungen','datenschutz','newsletter','beschaeftigungsverhaeltnis',
      // Flags
      'hatBestehendeKredite','hatBaufinanzierung',
      // Objektdaten
      'objektart','baujahr','grundstuecksgroesse','wohnflaeche','kaufpreis','modernisierungen'
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
      'gehaltsabrechnung3',
      'steuerbescheid1',
      'steuerbescheid2',
      'steuerbescheid3',
      'bwaGuV',
      'meldebescheinigung',
      'bestehendeKredite',
      'baufinanzierungNachweis',
      'jahreskontoauszug',
      'kontoauszug',
      'expose'
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

    // Uploads temporär serverseitig speichern (z.B. zur Nachverfolgung)
    try {
      const baseDir = path.join(process.cwd(), 'uploads', 'kreditanfragen')
      const requestDir = path.join(baseDir, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
      fs.mkdirSync(requestDir, { recursive: true })
      for (const att of attachments) {
        const filePath = path.join(requestDir, att.filename)
        // fs.writeFileSync erwartet string oder ArrayBufferView; Buffer ist iterierbar,
        // daher konvertieren wir ihn explizit zu Uint8Array für typsichere Übergabe.
        const bytes = Uint8Array.from(att.content)
        fs.writeFileSync(filePath, bytes)
      }
      console.info('[Kreditanfrage] Anhänge gespeichert:', {
        dir: requestDir,
        count: attachments.length,
        files: attachments.map(a => a.filename)
      })
    } catch (storeErr) {
      console.warn('Temporäres Speichern der Uploads fehlgeschlagen:', storeErr)
    }

    // Serverseitige Minimal-Validierung (spiegelt die wichtigsten Regeln)
    const missing: string[] = []
    const isSelbststaendig = (data.beschaeftigungsverhaeltnis || '').toLowerCase() === 'selbstständig' || (data.beschaeftigungsverhaeltnis || '').toLowerCase() === 'selbststaendig'
    const getFile = (name: string) => form.get(name) as File | null
    if (isSelbststaendig) {
      if (!getFile('steuerbescheid1')) missing.push('Steuerbescheid Jahr 1')
      if (!getFile('steuerbescheid2')) missing.push('Steuerbescheid Jahr 2')
      if (!getFile('steuerbescheid3')) missing.push('Steuerbescheid Jahr 3')
      // BWA optional
    } else {
      if (!getFile('gehaltsabrechnung1')) missing.push('Gehaltsabrechnung 1')
      if (!getFile('gehaltsabrechnung2')) missing.push('Gehaltsabrechnung 2')
      if (!getFile('gehaltsabrechnung3')) missing.push('Gehaltsabrechnung 3')
    }
    if (!getFile('kontoauszug')) missing.push('Kontoauszug letzter Monat')
    if ((data.staatsangehoerigkeit || '').toLowerCase() !== 'deutsch' && !getFile('meldebescheinigung')) missing.push('Meldebescheinigung')
    const hasBestehendeKredite = (data.hatBestehendeKredite || '').toLowerCase() === 'true'
    const hasBaufinanzierung = (data.hatBaufinanzierung || '').toLowerCase() === 'true'
    if (hasBestehendeKredite && !getFile('bestehendeKredite')) missing.push('Nachweis bestehende Kredite')
    if (hasBaufinanzierung && !getFile('baufinanzierungNachweis')) missing.push('Nachweis bestehende Baufinanzierung')
    if ((hasBestehendeKredite || hasBaufinanzierung) && !getFile('jahreskontoauszug')) missing.push('Jahreskontoauszug')
    if ((data.produktKategorie || '') === 'baufinanzierung') {
      const objektdatenOk = !!(data.objektart && data.baujahr && data.grundstuecksgroesse && data.wohnflaeche && data.kaufpreis)
      if (!getFile('expose') && !objektdatenOk) missing.push('Expose oder vollständige Objektdaten')
    }

    if (missing.length > 0) {
      return NextResponse.json({ error: 'Fehlende Dokumente', missing }, { status: 400 })
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
            <strong>Geburtsort:</strong> ${data.geburtsort}<br/>
            <strong>Familienstand:</strong> ${data.familienstand}<br/>
            <strong>Staatsangehörigkeit:</strong> ${data.staatsangehoerigkeit}<br/>
            <strong>E-Mail:</strong> ${email}<br/>
            <strong>Telefon:</strong> ${data.telefon}<br/>
            <strong>Adresse:</strong> ${data.strasse} ${data.hausnummer}, ${data.plz} ${data.ort}<br/>
            ${data.beschaeftigungsverhaeltnis ? `<strong>Beschäftigungsverhältnis:</strong> ${data.beschaeftigungsverhaeltnis}` : ''}
          </p>

          <h3 style="color:#16a34a;">Kreditwunsch</h3>
          <p>
            <strong>Kategorie:</strong> ${data.produktKategorie === 'baufinanzierung' ? 'Baufinanzierung' : 'Privatkredit'}<br/>
            ${data.produktKategorie === 'baufinanzierung'
              ? `
                <strong>Art der Baufinanzierung:</strong> ${data.baufinanzierungArt}<br/>
                <strong>Kaufpreis/Baukosten:</strong> ${data.kaufpreisBaukosten} €<br/>
                <strong>Eigenkapital:</strong> ${data.eigenkapital} €
                ${data.objektart ? `<br/><strong>Objektart:</strong> ${data.objektart}` : ''}
                ${data.baujahr ? `<br/><strong>Baujahr:</strong> ${data.baujahr}` : ''}
                ${data.grundstuecksgroesse ? `<br/><strong>Grundstücksgröße:</strong> ${data.grundstuecksgroesse} m²` : ''}
                ${data.wohnflaeche ? `<br/><strong>Wohnfläche:</strong> ${data.wohnflaeche} m²` : ''}
                ${data.kaufpreis ? `<br/><strong>Kaufpreis:</strong> ${data.kaufpreis} €` : ''}
                ${data.modernisierungen ? `<br/><strong>Letzte Modernisierungen:</strong> ${data.modernisierungen}` : ''}
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

    // Kundenkopie senden – gleiche CI, angepasster Betreff und Intro
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ihre Kreditanfrage ist eingegangen</title>
      </head>
      <body style="font-family: Arial, sans-serif; color:#111; line-height:1.5;">
        <div style="background:#0ea5e9; padding:20px; color:#fff;">
          <h2 style="margin:0;">Kreditheld24 – Eingangsbestätigung Ihrer Anfrage</h2>
        </div>
        <div style="padding:20px; border:1px solid #e5e7eb; border-top:none;">
          <p>Hallo ${data.vorname} ${data.nachname},</p>
          <p>vielen Dank für Ihre Kreditanfrage. Wir haben Ihre Angaben erhalten und melden uns zeitnah bei Ihnen. Unten finden Sie die Zusammenfassung Ihrer Daten.</p>
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />
          ${html}
          <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;" />
          <p style="font-size:12px; color:#6b7280;">Diese E-Mail wurde automatisch generiert. Antworten Sie gern direkt auf diese Nachricht, falls Sie noch Unterlagen oder Hinweise ergänzen möchten.</p>
        </div>
      </body>
      </html>
    `

    try {
      await transporter.sendMail({
        from: {
          name: 'Kreditheld24',
          address: process.env.SMTP_USER || 'info@kreditheld24.de'
        },
        to: email,
        replyTo: 'info@kreditheld24.de',
        subject: 'Ihre Kreditanfrage ist eingegangen – Kreditheld24',
        html: customerHtml,
        attachments
      })
    } catch (custErr) {
      console.warn('Kundenkopie konnte nicht gesendet werden:', custErr)
    }

    return NextResponse.json({ success: true, message: 'Kreditanfrage gesendet' })
  } catch (error) {
    console.error('Fehler bei der Kreditanfrage:', error)
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 })
  }
}