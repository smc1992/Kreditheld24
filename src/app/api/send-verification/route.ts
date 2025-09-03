import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { storeVerificationToken } from '@/lib/verification'

// Email-Transporter konfigurieren
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true für 465, false für andere Ports
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
    
    // Verification Link erstellen
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/verify-email/${token}`
    
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

    // E-Mail senden
    await transporter.sendMail(mailOptions)
    
    // Token in temporärem Store speichern
    storeVerificationToken(token, email, formData)
    
    return NextResponse.json({ 
      success: true, 
      token,
      message: 'Bestätigungs-E-Mail wurde gesendet' 
    })
    
  } catch (error) {
    console.error('Fehler beim Senden der Bestätigungs-E-Mail:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der E-Mail' },
      { status: 500 }
    )
  }
}