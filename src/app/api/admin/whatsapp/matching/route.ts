import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, crmCustomers } from '@/db';
import { eq, ilike, or, sql, and, isNull, ne } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - Get unlinked WhatsApp conversations with match suggestions
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get conversations without a customer link
    const unlinked = await db.select()
      .from(whatsappConversations)
      .where(isNull(whatsappConversations.customerId));

    // For each unlinked conversation, find potential customer matches
    const suggestions = [];
    for (const conv of unlinked) {
      if (!conv.phoneNumber) continue;

      const lastDigits = conv.phoneNumber.slice(-8);
      if (lastDigits.length < 6) continue;

      const matches = await db.select({
        id: crmCustomers.id,
        firstName: crmCustomers.firstName,
        lastName: crmCustomers.lastName,
        phone: crmCustomers.phone,
        email: crmCustomers.email,
      })
        .from(crmCustomers)
        .where(ilike(crmCustomers.phone, `%${lastDigits}%`))
        .limit(5);

      if (matches.length > 0) {
        suggestions.push({
          conversation: {
            id: conv.id,
            pushName: conv.pushName,
            phoneNumber: conv.phoneNumber,
            remoteJid: conv.remoteJid,
          },
          matches,
        });
      }
    }

    return NextResponse.json({ success: true, suggestions, totalUnlinked: unlinked.length });
  } catch (error) {
    console.error('[WhatsApp Matching] Error:', error);
    return NextResponse.json({ success: true, suggestions: [], totalUnlinked: 0 });
  }
}
