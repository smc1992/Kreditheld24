import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import { getPayload } from 'payload'
import config from '@payload-config'

// Rate limiting store (in production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_MAX = 3 // Max 3 emails per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Rate limiting check
const checkRateLimit = (email: string): boolean => {
  const now = Date.now()
  const userLimit = rateLimitStore.get(email)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(email, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false
  }
  
  userLimit.count++
  return true
}

// Generate email template
const generateEmailTemplate = (verificationLink: string, email: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>E-Mail-Bestätigung - Kreditheld24</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏦 Kreditheld24</h1>
          <h2>E-Mail-Bestätigung erforderlich</h2>
        </div>
        <div class="content">
          <p>Hallo,</p>
          <p>vielen Dank für Ihre Kreditanfrage bei Kreditheld24. Um fortzufahren, müssen Sie Ihre E-Mail-Adresse bestätigen.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" class="button">E-Mail-Adresse bestätigen</a>
          </div>
          
          <p><strong>Wichtige Informationen:</strong></p>
          <ul>
            <li>Dieser Link ist 24 Stunden gültig</li>
            <li>Nach der Bestätigung können Sie Ihre Dokumente hochladen</li>
            <li>Ihre Daten werden sicher und verschlüsselt übertragen</li>
          </ul>
          
          <p>Falls Sie diese E-Mail nicht angefordert haben, können Sie sie ignorieren.</p>
          
          <div class="footer">
            <p>© 2024 Kreditheld24 - Ihr vertrauensvoller Kreditpartner</p>
            <p>Diese E-Mail wurde an ${email} gesendet</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: NextRequest) {
  try {
    const { email, formData } = await request.json()
    
    // Validate input
    if (!email || !formData) {
      return NextResponse.json(
        { error: 'E-Mail und Formulardaten sind erforderlich' },
        { status: 400 }
      )
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      )
    }
    
    // Rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte warten Sie eine Stunde.' },
        { status: 429 }
      )
    }
    
    // Generate verification token
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // Save to database
    const payload = await getPayload({ config })
    
    await payload.create({
      collection: 'email-verifications' as any,
      data: {
        email,
        token,
        formData: JSON.stringify(formData),
        verified: false,
        expiresAt: expiresAt.toISOString(),
      },
    })
    
    // Generate verification link
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const verificationLink = `${baseUrl}/api/verify-email/${token}`
    
    // Send email
    const transporter = createTransporter()
    const emailTemplate = generateEmailTemplate(verificationLink, email)
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@kreditheld24.de',
      to: email,
      subject: 'Bestätigen Sie Ihre E-Mail-Adresse - Kreditheld24',
      html: emailTemplate,
    })
    
    console.log(`Verification email sent to ${email} with token ${token}`)
    
    return NextResponse.json({
      success: true,
      message: 'Bestätigungs-E-Mail wurde gesendet',
      token, // Return token for frontend tracking
    })
    
  } catch (error) {
    console.error('Error sending verification email:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der E-Mail' },
      { status: 500 }
    )
  }
}