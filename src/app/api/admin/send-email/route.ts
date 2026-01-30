import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmActivities, crmEmails, crmSettings, crmCustomers } from '@/db';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, cc, bcc, type, data, attachments } = body;

    if (!to || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: to, type' },
        { status: 400 }
      );
    }

    // Process CC and BCC
    const ccList = cc ? cc.split(',').map((e: string) => e.trim()).filter(Boolean) : undefined;
    const bccList = bcc ? bcc.split(',').map((e: string) => e.trim()).filter(Boolean) : undefined;

    // Process Attachments
    const resendAttachments = attachments ? attachments.map((att: any) => ({
      filename: att.filename,
      content: Buffer.from(att.content, 'base64')
    })) : undefined;

    if (resendAttachments && resendAttachments.length > 0) {
      console.log(`Sending email with ${resendAttachments.length} attachments to ${to}`);
      resendAttachments.forEach((att: any) => console.log(` - ${att.filename} (${att.content.length} bytes)`));
    }

    // AUTO-LINKING: Link email to customer if not already linked
    if (!data.customerId) {
      // Try to find customer by email matching 'to' address
      // Assuming 'to' is a single email address string here
      const normalizedTo = to.trim().toLowerCase();
      const customerMatch = await db.select().from(crmCustomers).where(eq(crmCustomers.email, normalizedTo)).limit(1);

      if (customerMatch && customerMatch.length > 0) {
        data.customerId = customerMatch[0].id;
        console.log(`Auto-linked email to customer: ${customerMatch[0].id} (${customerMatch[0].firstName} ${customerMatch[0].lastName})`);
      }
    }

    let subject = data.subject || 'Nachricht von Kreditheld24';

    // Signatur aus DB laden (oder Default)
    const settings = await db.select().from(crmSettings).where(eq(crmSettings.id, 'system_config')).limit(1);

    const defaultSignature = `
      <br><br>
      --<br>
      <strong>Kreditheld24 Team</strong><br>
      Kreditheld24 GmbH<br>
      Musterstraße 123, 10115 Berlin<br>
      <a href="https://kreditheld24.de">www.kreditheld24.de</a>
    `;

    const signature = settings[0]?.signature || defaultSignature;

    const fullHtmlContent = (data.message || '') + signature;

    // Automatische Aktivität loggen & E-Mail speichern
    try {
      // 1. E-Mail zuerst speichern um ID zu erhalten
      const emailRecord = await db.insert(crmEmails).values({
        customerId: data.customerId || null,
        caseId: data.caseId || null,
        direction: 'outbound',
        from: 'Kreditheld24 Team <info@kreditheld24.de>',
        to: to,
        subject: subject,
        htmlContent: fullHtmlContent,
        status: 'sent',
        isRead: true,
        hasAttachments: !!(resendAttachments && resendAttachments.length > 0),
        date: new Date()
      }).returning({ id: crmEmails.id });

      // 2. Aktivität mit Referenz loggen
      await db.insert(crmActivities).values({
        customerId: data.customerId || null,
        caseId: data.caseId || null,
        type: 'email',
        emailId: emailRecord[0]?.id,
        subject: `E-Mail versendet: ${subject}`,
        description: `E-Mail an ${to} versendet.${cc ? ` (CC: ${cc})` : ''}${bcc ? ` (BCC: ${bcc})` : ''}`,
        date: new Date(),
        createdBy: session.user.id
      });
    } catch (logError) {
      console.error('Failed to log email activity/storage:', logError);
    }

    // Echte Resend-Integration
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        cc: ccList,
        bcc: bccList,
        subject: subject,
        html: fullHtmlContent,
        attachments: resendAttachments
      });
    } catch (e) {
      console.error('Resend error:', e);
      return NextResponse.json(
        { success: false, error: 'Failed to send email via Resend' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email processed and activity logged'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
