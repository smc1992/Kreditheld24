import { NextResponse } from 'next/server';
import { db, crmEmails, crmCustomers, crmActivities } from '@/db';
import { eq } from 'drizzle-orm';

// Dieser Endpunkt wird von Resend Inbound oder Mailgun Webhooks aufgerufen
// MX Records müssen auf den Provider zeigen
export async function POST(request: Request) {
  try {
    // In Produktion: Validierung des Webhook-Secrets vom Provider
    const payload = await request.json();
    
    // Extraktion der Daten (Format variiert je nach Provider, hier beispielhaft für Resend/Generic)
    const fromAddress = payload.from || payload.sender;
    const toAddress = payload.to || payload.recipient;
    const subject = payload.subject;
    const htmlContent = payload.html || payload.body_html;
    const textContent = payload.text || payload.body_text;
    const messageId = payload.messageId || payload['Message-ID'];

    // 1. Kunden automatisch anhand der E-Mail-Adresse finden
    const customer = await db.query.crmCustomers.findFirst({
      where: eq(crmCustomers.email, fromAddress)
    });

    // 2. E-Mail in der Datenbank speichern
    const [newEmail] = await db.insert(crmEmails).values({
      customerId: customer?.id || null,
      messageId,
      direction: 'inbound',
      from: fromAddress,
      to: toAddress,
      subject,
      htmlContent,
      textContent,
      status: 'received',
      isRead: false,
      date: new Date()
    }).returning();

    // 3. Aktivität im CRM loggen, falls Kunde gefunden wurde
    if (customer) {
      await db.insert(crmActivities).values({
        customerId: customer.id,
        type: 'email',
        subject: `E-Mail empfangen: ${subject}`,
        description: `Eingehende Nachricht von ${fromAddress} wurde im Posteingang registriert.`,
        date: new Date(),
        createdBy: 'system' // System-User ID oder spezieller Identifier
      });
    }

    return NextResponse.json({ success: true, id: newEmail.id });
  } catch (error) {
    console.error('Error processing inbound email:', error);
    return NextResponse.json({ error: 'Failed to process email' }, { status: 500 });
  }
}
