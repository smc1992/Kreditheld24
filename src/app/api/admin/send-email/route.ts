import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmActivities, crmEmails } from '@/db';
// TODO: Uncomment after installing packages: npm install resend react-email @react-email/components
// import { resend, FROM_EMAIL } from '@/lib/resend';
// import { CustomerWelcomeEmail } from '../../../../../emails/CustomerWelcome';
// import { CaseUpdateEmail } from '../../../../../emails/CaseUpdate';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, type, data } = body;

    if (!to || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: to, type' },
        { status: 400 }
      );
    }

    let subject = data.subject || 'Nachricht von Kreditheld24';
    
    // Automatische Aktivität loggen
    try {
      await db.insert(crmActivities).values({
        customerId: data.customerId || null,
        caseId: data.caseId || null,
        type: 'email',
        subject: `E-Mail versendet: ${subject}`,
        description: `E-Mail an ${to} versendet.`,
        date: new Date(),
        createdBy: session.user.id
      });

      // E-Mail im Postausgang speichern
      await db.insert(crmEmails).values({
        customerId: data.customerId || null,
        caseId: data.caseId || null,
        direction: 'outbound',
        from: 'Kreditheld24 Team <info@kreditheld24.de>',
        to: to,
        subject: subject,
        htmlContent: data.message,
        status: 'sent',
        isRead: true,
        date: new Date()
      });
    } catch (logError) {
      console.error('Failed to log email activity/storage:', logError);
    }

    // Echte Resend-Integration (falls konfiguriert)
    /* 
    try {
      const { resend, FROM_EMAIL } = await import('@/lib/resend');
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html: data.message // Hier wird der HTML Content aus dem Editor erwartet
      });
    } catch (e) {
      console.log('Resend not configured, skipping live send');
    }
    */

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
