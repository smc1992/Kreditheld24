import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCaseMessages, crmCases, crmCustomers, adminUsers } from '@/db';
import { eq, desc, and } from 'drizzle-orm';
import { sendNewMessageNotification } from '@/lib/email-notifications';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: caseId } = await params;

    // Verify case belongs to user
    const caseData = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, caseId),
    });

    if (!caseData || caseData.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch messages with sender details
    const messages = await db
      .select({
        id: crmCaseMessages.id,
        message: crmCaseMessages.message,
        senderType: crmCaseMessages.senderType,
        senderId: crmCaseMessages.senderId,
        isRead: crmCaseMessages.isRead,
        createdAt: crmCaseMessages.createdAt,
      })
      .from(crmCaseMessages)
      .where(eq(crmCaseMessages.caseId, caseId))
      .orderBy(crmCaseMessages.createdAt);

    // Enrich with sender names
    const enrichedMessages = await Promise.all(
      messages.map(async (msg) => {
        let senderName = 'Unbekannt';
        
        if (msg.senderType === 'customer') {
          const customer = await db.query.crmCustomers.findFirst({
            where: eq(crmCustomers.id, msg.senderId),
          });
          senderName = customer ? `${customer.firstName} ${customer.lastName}` : 'Kunde';
        } else if (msg.senderType === 'admin') {
          const admin = await db.query.adminUsers.findFirst({
            where: eq(adminUsers.id, msg.senderId),
          });
          senderName = admin?.name || 'Kreditheld24 Team';
        }

        return {
          ...msg,
          senderName,
        };
      })
    );

    // Mark customer's unread messages as read
    await db.update(crmCaseMessages)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(crmCaseMessages.caseId, caseId),
          eq(crmCaseMessages.senderType, 'admin'),
          eq(crmCaseMessages.isRead, false)
        )
      );

    return NextResponse.json({ messages: enrichedMessages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Nachrichten.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: caseId } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nachricht darf nicht leer sein.' },
        { status: 400 }
      );
    }

    // Verify case belongs to user
    const caseData = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, caseId),
      with: {
        customer: true,
      },
    });

    if (!caseData || caseData.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create message
    const [newMessage] = await db.insert(crmCaseMessages).values({
      caseId,
      senderId: session.user.id,
      senderType: 'customer',
      message: message.trim(),
      isRead: false,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({ 
      success: true, 
      message: newMessage,
      messageText: 'Nachricht erfolgreich gesendet.' 
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der Nachricht.' },
      { status: 500 }
    );
  }
}
