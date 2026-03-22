import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, whatsappMessages, crmCustomers } from '@/db';
import { desc, eq, ilike, or, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET /api/admin/whatsapp/conversations - List all conversations
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const archived = searchParams.get('archived') === 'true';

    let whereClause;
    if (search) {
      const searchPattern = `%${search}%`;
      whereClause = or(
        ilike(whatsappConversations.pushName, searchPattern),
        ilike(whatsappConversations.phoneNumber, searchPattern),
        ilike(whatsappConversations.lastMessagePreview, searchPattern),
      );
    }

    // Get conversations with optional customer data
    const conversations = await db
      .select({
        id: whatsappConversations.id,
        remoteJid: whatsappConversations.remoteJid,
        pushName: whatsappConversations.pushName,
        phoneNumber: whatsappConversations.phoneNumber,
        profilePicUrl: whatsappConversations.profilePicUrl,
        customerId: whatsappConversations.customerId,
        unreadCount: whatsappConversations.unreadCount,
        lastMessageAt: whatsappConversations.lastMessageAt,
        lastMessagePreview: whatsappConversations.lastMessagePreview,
        isArchived: whatsappConversations.isArchived,
        aiEnabled: whatsappConversations.aiEnabled,
        createdAt: whatsappConversations.createdAt,
        // Customer join data
        customerFirstName: crmCustomers.firstName,
        customerLastName: crmCustomers.lastName,
        customerEmail: crmCustomers.email,
      })
      .from(whatsappConversations)
      .leftJoin(crmCustomers, eq(whatsappConversations.customerId, crmCustomers.id))
      .where(whereClause)
      .orderBy(desc(whatsappConversations.lastMessageAt))
      .limit(100);

    // Count total unread
    const unreadTotal = await db
      .select({ total: sql<number>`COALESCE(SUM(${whatsappConversations.unreadCount}), 0)` })
      .from(whatsappConversations);

    return NextResponse.json({
      success: true,
      data: conversations,
      totalUnread: Number(unreadTotal[0]?.total || 0),
    });
  } catch (error) {
    console.error('[WhatsApp API] Error fetching conversations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
