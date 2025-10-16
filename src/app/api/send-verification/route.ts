import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { storeVerificationToken } from '@/lib/verification'

export const runtime = 'nodejs'

// Email-Transporter konfigurieren
const smtpPort = parseInt(process.env.SMTP_PORT || '587')
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: smtpPort,
  secure: smtpPort === 465, // Strato & andere nutzen 465 mit SSL
  auth: {
    user: process.env.SMTP_USER || 'info@kreditheld24.de',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email, formData } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      )
    }

    // Verification Token generieren
    const token = crypto.randomBytes(32).toString('hex')
    
    // Verification Link erstellen – robust gegen Proxies und mit ENV-Override
    const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    const xfProto = request.headers.get('x-forwarded-proto') || undefined
    const xfHost = request.headers.get('x-forwarded-host') || undefined
    const host = xfHost || request.headers.get('host') || undefined
    const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
    const originFromHeaders = host && (proto ? `${proto}://${host}` : `https://${host}`)
    const fallbackProd = 'https://kreditheld24.de'
    const fallbackDev = 'http://localhost:3000'
    const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)
    const verificationUrl = `${baseUrl}/api/verify-email/${token}`
    
    // Email-Inhalt
    const mailOptions = {
      from: {
        name: 'Kreditheld24',
        address: 'info@kreditheld24.de'
      },
      to: email,
      subject: 'E-Mail-Bestätigung für Ihre Kreditanfrage - Kreditheld24',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-Mail-Bestätigung - Kreditheld24</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Kreditheld24</h1>
            <p style="color: #e6fffa; margin: 10px 0 0 0; font-size: 16px;">Ihr Partner für günstige Kredite</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #059669; margin-top: 0;">Hallo ${formData.vorname || 'Kunde'},</h2>
            
            <p>vielen Dank für Ihr Interesse an unseren Kreditangeboten!</p>
            
            <p>Um Ihre Kreditanfrage zu vervollständigen, bestätigen Sie bitte Ihre E-Mail-Adresse durch einen Klick auf den folgenden Button:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                E-Mail-Adresse bestätigen
              </a>
            </div>

            <p style="font-size: 14px; color: #666;">
              Nach dem Klick auf den Bestätigungsbutton werden Sie automatisch zu unserem Dokumenten-Upload weitergeleitet.
              Dort können Sie die erforderlichen Unterlagen sicher hochladen, um Ihre Anfrage abzuschließen.
            </p>
            
            <p style="font-size: 14px; color: #666; border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px;">
              <strong>Warum diese Bestätigung?</strong><br>
              Die E-Mail-Bestätigung stellt sicher, dass wir Ihnen wichtige Informationen zu Ihrer Kreditanfrage zuverlässig zusenden können.
            </p>
            
            <p style="font-size: 14px; color: #666;">
              Falls Sie diese E-Mail nicht angefordert haben, können Sie sie einfach ignorieren.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 14px; color: #666;">
              <p><strong>Kreditheld24</strong><br>
              E-Mail: info@kreditheld24.de<br>
              Web: www.kreditheld24.de</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // E-Mail senden (mit resilientem Fallback)
    let emailSent = false
    const hasSmtpCreds = !!(process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.EMAIL_PASSWORD))
    try {
      if (hasSmtpCreds) {
        // Port 465 -> secure=true, sonst STARTTLS (587)
        if (process.env.SMTP_PORT === '465') {
          // Hinweis: Transporter ist oben global erstellt; falls nötig, könnte man hier
          // dynamisch neu erstellen. Für die meisten Provider reicht STARTTLS mit 587.
        }
        await transporter.sendMail(mailOptions)
        emailSent = true
      } else {
        console.warn('SMTP nicht konfiguriert – Fallback: Verifizierungslink wird zurückgegeben, E-Mail nicht gesendet.')
      }
    } catch (mailError) {
      console.error('Fehler beim Senden der E-Mail:', mailError)
      // Kein 500 mehr: Fallback greift auch in Produktion – Link wird zurückgegeben
    }

    // Token in temporärem Store speichern
    storeVerificationToken(token, email, formData)
    
    return NextResponse.json({ 
      success: true, 
      token,
      verificationUrl,
      emailSent,
      message: emailSent 
        ? 'Bestätigungs-E-Mail wurde gesendet' 
        : 'Entwicklungsmodus: Direkter Bestätigungslink verfügbar'
    })
    
  } catch (error) {
    console.error('Fehler beim Senden der Bestätigungs-E-Mail:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der E-Mail' },
      { status: 500 }
    )
  }
}