import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappMessages } from '@/db';
import { eq } from 'drizzle-orm';
import { deleteMessageForEveryone } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/whatsapp/messages/[id] - Update message (e.g. star/unstar)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isStarred } = body;

    const message = await db.select().from(whatsappMessages).where(eq(whatsappMessages.id, id)).limit(1);
    if (!message.length) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const updatedMsg = await db.update(whatsappMessages)
      .set({ isStarred })
      .where(eq(whatsappMessages.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedMsg[0] });
  } catch (error) {
    console.error('[WhatsApp API] Error updating message:', error);
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}

// DELETE /api/admin/whatsapp/messages/[id] - Delete message for everyone
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const message = await db.select().from(whatsappMessages).where(eq(whatsappMessages.id, id)).limit(1);
    if (!message.length) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const msg = message[0];

    // Only allow deleting messages sent by us (or if the API allows it for incoming too, but usually it's just ours)
    if (!msg.isFromMe) {
      return NextResponse.json({ error: 'Cannot delete incoming messages for everyone' }, { status: 400 });
    }

    if (msg.messageId) {
      try {
        await deleteMessageForEveryone(msg.remoteJid, msg.messageId, true);
      } catch (evoErr) {
        console.error('[Evolution API] Error deleting message:', evoErr);
        // We might still want to mark it deleted locally even if Evolution fails, but it's risky
        return NextResponse.json({ success: false, error: 'Failed to delete on WhatsApp' }, { status: 500 });
      }
    }

    const updatedMsg = await db.update(whatsappMessages)
      .set({ isDeleted: true, content: 'Diese Nachricht wurde gelöscht.' })
      .where(eq(whatsappMessages.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedMsg[0] });
  } catch (error) {
    console.error('[WhatsApp API] Error deleting message:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
  }
}
