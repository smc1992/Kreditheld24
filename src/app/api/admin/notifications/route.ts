import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmActivities, crmCustomers, crmCases } from '@/db';
import { desc, eq, and, isNull, inArray } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get unread emails
    const unreadEmails = await db.select().from(crmActivities)
      .where(and(
        eq(crmActivities.type, 'email'),
        // In a real system, we would have an 'isRead' flag on activities or emails
      ))
      .orderBy(desc(crmActivities.date))
      .limit(5);

    // 2. Get recent system warnings, updates, OR document uploads
    const recentSystem = await db.select().from(crmActivities)
      .where(inArray(crmActivities.type, ['system', 'document']))
      .orderBy(desc(crmActivities.date))
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        emails: unreadEmails,
        system: recentSystem,
        count: unreadEmails.length + recentSystem.length
      }
    });
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
