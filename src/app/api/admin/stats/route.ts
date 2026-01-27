import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers, crmCases, crmActivities } from '@/db';
import { count } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [customers, cases, activities] = await Promise.all([
      db.select({ count: count() }).from(crmCustomers),
      db.select({ count: count() }).from(crmCases),
      db.select({ count: count() }).from(crmActivities),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        customers: customers[0]?.count || 0,
        cases: cases[0]?.count || 0,
        activities: activities[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
