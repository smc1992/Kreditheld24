
import { NextRequest, NextResponse } from 'next/server';
import { db, crmCases, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { fetchEmailsForCustomer } from '@/lib/imap';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: caseId } = await params;

    const caseData = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, caseId),
      with: {
        customer: true
      }
    });

    if (!caseData || !caseData.customer || !caseData.customer.email) {
      return NextResponse.json({ messages: [] }); // Customer or email missing, return empty
    }

    const emails = await fetchEmailsForCustomer(caseData.customer.email);

    return NextResponse.json({ messages: emails });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: caseId } = await params;
    const body = await request.json();
    const { message } = body;

    const caseData = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, caseId),
      with: { customer: true }
    });

    if (!caseData || !caseData.customer || !caseData.customer.email) {
      return NextResponse.json({ error: 'Customer email not found' }, { status: 404 });
    }

    // Send via Resend
    await resend.emails.send({
      from: FROM_EMAIL,
      to: caseData.customer.email,
      subject: `Re: Ihre Anfrage ${caseData.caseNumber}`,
      text: message,
    });

    return NextResponse.json({ success: true, notificationSent: true });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
