import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, whatsappMessages, crmCustomers } from '@/db';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { sendTextMessage, cleanPhoneNumber } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

// GET - Get WhatsApp chat for a specific customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;

    // 1. Find conversation linked to this customer
    let conversation = await db.select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.customerId, customerId))
      .limit(1);

    // 2. If no conversation linked, try to match by phone
    if (conversation.length === 0) {
      const customer = await db.select({ phone: crmCustomers.phone })
        .from(crmCustomers)
        .where(eq(crmCustomers.id, customerId))
        .limit(1);

      if (customer.length > 0 && customer[0].phone) {
        const phone = customer[0].phone.replace(/[^0-9]/g, '');
        const lastDigits = phone.slice(-8);

        if (lastDigits.length >= 6) {
          conversation = await db.select()
            .from(whatsappConversations)
            .where(ilike(whatsappConversations.phoneNumber, `%${lastDigits}%`))
            .limit(1);

          // Auto-link if found
          if (conversation.length > 0) {
            await db.update(whatsappConversations)
              .set({ customerId })
              .where(eq(whatsappConversations.id, conversation[0].id));
          }
        }
      }
    }

    if (conversation.length === 0) {
      return NextResponse.json({
        success: true,
        conversation: null,
        messages: [],
        matchSuggestions: [],
      });
    }

    // 3. Load messages
    const messages = await db.select()
      .from(whatsappMessages)
      .where(eq(whatsappMessages.conversationId, conversation[0].id))
      .orderBy(sql`${whatsappMessages.timestamp} ASC`)
      .limit(100);

    return NextResponse.json({
      success: true,
      conversation: conversation[0],
      messages,
    });
  } catch (error) {
    console.error('[Customer WhatsApp] Error:', error);
    return NextResponse.json({ error: 'Failed to load WhatsApp data' }, { status: 500 });
  }
}

// POST - Send a WhatsApp message from customer profile
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Message text required' }, { status: 400 });
    }

    // Find conversation for customer
    let conversation = await db.select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.customerId, customerId))
      .limit(1);

    if (conversation.length === 0) {
      // Try to find by phone number
      const customer = await db.select({ phone: crmCustomers.phone })
        .from(crmCustomers)
        .where(eq(crmCustomers.id, customerId))
        .limit(1);

      if (customer.length === 0 || !customer[0].phone) {
        return NextResponse.json({ error: 'Kein WhatsApp-Kontakt für diesen Kunden gefunden' }, { status: 404 });
      }

      const phone = customer[0].phone.replace(/[^0-9]/g, '');
      const lastDigits = phone.slice(-8);

      conversation = await db.select()
        .from(whatsappConversations)
        .where(ilike(whatsappConversations.phoneNumber, `%${lastDigits}%`))
        .limit(1);

      if (conversation.length === 0) {
        return NextResponse.json({ error: 'Kein WhatsApp-Chat gefunden. Der Kunde muss zuerst eine Nachricht senden.' }, { status: 404 });
      }
    }

    const conv = conversation[0];

    // Send via Evolution API
    const result = await sendTextMessage(conv.remoteJid, text);

    // Save message
    const [savedMsg] = await db.insert(whatsappMessages).values({
      conversationId: conv.id,
      messageId: result?.key?.id || null,
      remoteJid: conv.remoteJid,
      sender: 'admin',
      content: text,
      messageType: 'text',
      isFromMe: true,
      isRead: true,
      timestamp: new Date(),
    }).returning();

    // Update conversation
    await db.update(whatsappConversations)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: text.substring(0, 200),
        updatedAt: new Date(),
      })
      .where(eq(whatsappConversations.id, conv.id));

    return NextResponse.json({ success: true, message: savedMsg });
  } catch (error) {
    console.error('[Customer WhatsApp] Send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
