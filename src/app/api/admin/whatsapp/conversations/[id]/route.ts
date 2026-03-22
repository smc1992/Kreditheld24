import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations } from '@/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// PATCH /api/admin/whatsapp/conversations/[id] - Update conversation settings
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

    const updateData: Record<string, any> = {};
    if (typeof body.aiEnabled === 'boolean') updateData.aiEnabled = body.aiEnabled;
    if (typeof body.isArchived === 'boolean') updateData.isArchived = body.isArchived;
    if (body.customerId !== undefined) updateData.customerId = body.customerId || null;
    updateData.updatedAt = new Date();

    await db.update(whatsappConversations)
      .set(updateData)
      .where(eq(whatsappConversations.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp API] Error updating conversation:', error);
    return NextResponse.json({ success: false, error: 'Failed to update conversation' }, { status: 500 });
  }
}
