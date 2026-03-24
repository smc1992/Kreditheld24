import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { storeVerificationToken } from '../../../lib/verification'
import { db, crmCustomers, crmCases } from '@/db'
import { eq, and } from 'drizzle-orm'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { email, formData } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      )
    }

    // 1. CRM Integration: Kunde finden oder erstellen
    let customerId: string;
    const existingCustomers = await db.select().from(crmCustomers).where(eq(crmCustomers.email, email.toLowerCase()));

    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
      // Namen ggf. aktualisieren falls noch leer
      if (!existingCustomers[0].firstName || !existingCustomers[0].lastName) {
        await db.update(crmCustomers)
          .set({
            firstName: formData.vorname || existingCustomers[0].firstName,
            lastName: formData.nachname || existingCustomers[0].lastName,
            phone: formData.telefon || existingCustomers[0].phone,
            updatedAt: new Date()
          })
          .where(eq(crmCustomers.id, customerId));
      }
    } else {
      const [newCustomer] = await db.insert(crmCustomers).values({
        email: email.toLowerCase(),
        firstName: formData.vorname || 'Interessent',
        lastName: formData.nachname || '(Neu)',
        phone: formData.telefon || null,
      }).returning();
      customerId = newCustomer.id;
    }

    const isVerified = existingCustomers.length > 0 && !!existingCustomers[0].emailVerified;

    // 2. CRM Integration: Case finden oder erstellen (Status 'draft')
    let caseId: string;
    const existingDraftCases = await db.select().from(crmCases).where(
      and(
        eq(crmCases.customerId, customerId),
        eq(crmCases.status, 'draft')
      )
    );

    if (existingDraftCases.length > 0) {
      caseId = existingDraftCases[0].id;
      // Case-Daten aktualisieren
      await db.update(crmCases)
        .set({
          formData: formData,
          currentStep: 1,
          updatedAt: new Date(),
          status: isVerified ? 'open' : 'draft'
        })
        .where(eq(crmCases.id, caseId));
    } else {
      const caseNumber = `VG-WEB-${Date.now().toString().slice(-6)}`;
      const [newCase] = await db.insert(crmCases).values({
        customerId,
        caseNumber,
        status: isVerified ? 'open' : 'draft',
        formData: formData,
        currentStep: 1,
        requestedAmount: formData.kreditsumme ? formData.kreditsumme.toString() : null,
      }).returning();
      caseId = newCase.id;
    }

    // Verification Token generieren
    const token = crypto.randomBytes(32).toString('hex')

    // Verification Link erstellen – robust gegen Proxies und mit ENV-Override
    const envBaseUrl = process.env.VERIFICATION_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL
    const xfProto = request.headers.get('x-forwarded-proto') || undefined
    const xfHost = request.headers.get('x-forwarded-host') || undefined
    const hostHeader = xfHost || request.headers.get('host') || undefined
    const proto = xfProto || (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : undefined) || undefined
    const originFromHeaders = hostHeader && (proto ? `${proto}://${hostHeader}` : `https://${hostHeader}`)
    const fallbackProd = 'https://kreditheld24.de'
    const fallbackDev = 'http://localhost:3000'
    const baseUrl = envBaseUrl || originFromHeaders || request.nextUrl?.origin || (process.env.NODE_ENV === 'production' ? fallbackProd : fallbackDev)
    const verificationUrl = `${baseUrl}/api/verify-email/${token}`

    // E-Mail senden (Verifizierung oder Eingangsbestätigung)
    console.log('Attempting to send email via Resend to:', email);

    // SMTP-Transporter konfigurieren
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.strato.de',
      port: smtpPort,
      secure: smtpPort === 465, // SSL nur bei 465
      auth: {
        user: process.env.SMTP_USER || 'info@kreditheld24.de',
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
      },
      tls: { rejectUnauthorized: false }
    })

    const fromAddress = {
      name: 'Kreditheld24',
      address: process.env.EMAIL_FROM || 'info@kreditheld24.de'
    }

    if (isVerified) {
      // E-Mail ist bereits verifiziert – KEINE E-Mail senden.
      // Die Eingangsbestätigung wird erst nach dem tatsächlichen Absenden der Anfrage versandt.
      // Der Kunde wird direkt zum Dokumenten-Upload weitergeleitet.
      console.log(`[Verification] E-Mail ${email} bereits verifiziert, überspringe zum Upload.`);
    } else {
      // Verifizierungs-E-Mail (Standard)
      try {
        const data = await transporter.sendMail({
          from: fromAddress,
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
                  E-Mail: info@kreditheld24.de<br>
                  Web: www.kreditheld24.de<br>
                  <span style="color: #ccc; font-size: 10px;">Gesendet: ${new Date().toLocaleString('de-DE')}</span></p>
                </div>
              </div>
            </body>
            </html>
          `
        });

        console.log('Email sent successfully via SMTP. ID:', data.messageId);
      } catch (emailError) {
        console.error('CRITICAL ERROR sending email via Resend:', emailError);
        return NextResponse.json(
          {
            success: false,
            error: 'E-Mail konnte nicht gesendet werden.',
            details: (emailError as Error).message
          },
          { status: 500 }
        );
      }
    }

    // Token in temporärem Store speichern (Redis oder FS)
    // Wir speichern die caseId mit, um sie später wiederherzustellen
    await storeVerificationToken(token, email, { ...formData, caseId })

    return NextResponse.json({
      success: true,
      token,
      verificationUrl,
      emailSent: true,
      caseId,
      verified: isVerified, // Return verified status to frontend
      message: 'Bestätigungs-E-Mail wurde gesendet'
    })

  } catch (error) {
    console.error('CRITICAL ERROR in /api/send-verification:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Ein interner Fehler ist aufgetreten.',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}
