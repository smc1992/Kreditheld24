import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, whatsappMessages } from '@/db';
import { eq } from 'drizzle-orm';
import { sendWhatsAppAudio } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

// POST /api/admin/whatsapp/conversations/[id]/messages/audio - Send a voice message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const conversation = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, id))
      .limit(1);

    if (!conversation.length) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const conv = conversation[0];
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const quotedMessageId = formData.get('quotedMessageId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    
    // Prepare quoted object if replying
    let quotedContent = null;
    let quotedObj = undefined;
    
    if (quotedMessageId) {
      const quotedMsg = await db.select().from(whatsappMessages).where(eq(whatsappMessages.messageId, quotedMessageId)).limit(1);
      if (quotedMsg.length > 0) {
        quotedContent = quotedMsg[0].content || `[${quotedMsg[0].messageType}]`;
        quotedObj = {
          key: { id: quotedMessageId, remoteJid: conv.remoteJid },
          message: { conversation: quotedContent }
        };
      }
    }

    // Send via Evolution API using the dedicated audio endpoint so it shows up as a Voice Note (ptt)
    const result = await sendWhatsAppAudio(conv.remoteJid, `data:${file.type};base64,${base64}`, quotedObj);
    const messageId = result?.key?.id || null;

    // Save to DB
    const newMsg = await db.insert(whatsappMessages).values({
      conversationId: id,
      messageId,
      remoteJid: conv.remoteJid,
      sender: 'admin',
      content: 'Sprachnachricht',
      messageType: 'audio',
      mediaUrl: null, // Depending on if we save locally later, Evolution just sends it
      mediaMimeType: file.type || 'audio/webm',
      mediaFileName: `audio-${Date.now()}.webm`,
      isFromMe: true,
      isRead: true,
      status: 'SENT',
      quotedMessageId,
      quotedContent,
      timestamp: new Date(),
    }).returning();

    // Update conversation preview
    await db.update(whatsappConversations)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: '🎤 Sprachnachricht',
        updatedAt: new Date(),
      })
      .where(eq(whatsappConversations.id, id));

    return NextResponse.json({ success: true, data: newMsg[0] });
  } catch (error) {
    console.error('[WhatsApp API] Error sending voice message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send voice message' }, { status: 500 });
  }
}
