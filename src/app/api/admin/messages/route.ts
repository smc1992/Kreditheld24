import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCaseMessages, crmCases, crmCustomers } from '@/db';
import { eq, desc, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all cases with messages, grouped by case
    const casesWithMessages = await db
      .select({
        caseId: crmCases.id,
        caseNumber: crmCases.caseNumber,
        customerId: crmCases.customerId,
        customerFirstName: crmCustomers.firstName,
        customerLastName: crmCustomers.lastName,
        customerEmail: crmCustomers.email,
        status: crmCases.status,
        lastMessageTime: sql<Date>`MAX(${crmCaseMessages.createdAt})`,
        totalMessages: sql<number>`COUNT(${crmCaseMessages.id})`,
        unreadMessages: sql<number>`COUNT(CASE WHEN ${crmCaseMessages.senderType} = 'customer' AND ${crmCaseMessages.isRead} = false THEN 1 END)`,
      })
      .from(crmCases)
      .innerJoin(crmCaseMessages, eq(crmCases.id, crmCaseMessages.caseId))
      .innerJoin(crmCustomers, eq(crmCases.customerId, crmCustomers.id))
      .groupBy(
        crmCases.id,
        crmCases.caseNumber,
        crmCases.customerId,
        crmCustomers.firstName,
        crmCustomers.lastName,
        crmCustomers.email,
        crmCases.status
      )
      .orderBy(desc(sql`MAX(${crmCaseMessages.createdAt})`));

    // Get last message for each case
    const conversationsWithLastMessage = await Promise.all(
      casesWithMessages.map(async (conv) => {
        const lastMessage = await db
          .select({
            message: crmCaseMessages.message,
            senderType: crmCaseMessages.senderType,
            createdAt: crmCaseMessages.createdAt,
          })
          .from(crmCaseMessages)
          .where(eq(crmCaseMessages.caseId, conv.caseId))
          .orderBy(desc(crmCaseMessages.createdAt))
          .limit(1);

        return {
          ...conv,
          lastMessage: lastMessage[0] || null,
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithLastMessage });
  } catch (error) {
    console.error('Fetch conversations error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Konversationen.' },
      { status: 500 }
    );
  }
}
