import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, whatsappMessages } from '@/db';
import { eq, inArray, sql } from 'drizzle-orm';
import { sendTextMessage } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

// GET - Get all conversations for broadcast selection
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await db.select({
      id: whatsappConversations.id,
      pushName: whatsappConversations.pushName,
      phoneNumber: whatsappConversations.phoneNumber,
      remoteJid: whatsappConversations.remoteJid,
      profilePicUrl: whatsappConversations.profilePicUrl,
      lastMessageAt: whatsappConversations.lastMessageAt,
    })
      .from(whatsappConversations)
      .orderBy(sql`${whatsappConversations.pushName} ASC`);

    return NextResponse.json({ success: true, contacts: conversations });
  } catch (error) {
    console.error('[Broadcast] Error:', error);
    return NextResponse.json({ error: 'Failed to load contacts' }, { status: 500 });
  }
}

// POST - Send broadcast message
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, contactIds } = await request.json();

    if (!text || !contactIds || contactIds.length === 0) {
      return NextResponse.json({ error: 'Text und mindestens ein Kontakt erforderlich' }, { status: 400 });
    }

    // Get selected conversations
    const conversations = await db.select({
      id: whatsappConversations.id,
      remoteJid: whatsappConversations.remoteJid,
      pushName: whatsappConversations.pushName,
    })
      .from(whatsappConversations)
      .where(inArray(whatsappConversations.id, contactIds));

    const results: Array<{ contactId: string; name: string; success: boolean; error?: string }> = [];

    // Send to each contact with a small delay to avoid rate limiting
    for (const conv of conversations) {
      try {
        const result = await sendTextMessage(conv.remoteJid, text);

        // Save message to DB
        await db.insert(whatsappMessages).values({
          conversationId: conv.id,
          messageId: result?.key?.id || null,
          remoteJid: conv.remoteJid,
          sender: 'admin',
          content: text,
          messageType: 'text',
          isFromMe: true,
          isRead: true,
          timestamp: new Date(),
        });

        // Update conversation
        await db.update(whatsappConversations)
          .set({
            lastMessageAt: new Date(),
            lastMessagePreview: text.substring(0, 200),
            updatedAt: new Date(),
          })
          .where(eq(whatsappConversations.id, conv.id));

        results.push({ contactId: conv.id, name: conv.pushName || conv.remoteJid, success: true });

        // Small delay between messages (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.push({
          contactId: conv.id,
          name: conv.pushName || conv.remoteJid,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      total: results.length,
      results,
    });
  } catch (error) {
    console.error('[Broadcast] Send error:', error);
    return NextResponse.json({ error: 'Broadcast fehlgeschlagen' }, { status: 500 });
  }
}
