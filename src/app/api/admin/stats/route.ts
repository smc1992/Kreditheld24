import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers, crmCases, crmActivities } from '@/db';
import { count, gte, and, lte, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Today start/end for follow-ups
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Count totals
    const [totalCustomers, totalCases, totalActivities] = await Promise.all([
      db.select({ count: count() }).from(crmCustomers),
      db.select({ count: count() }).from(crmCases),
      db.select({ count: count() }).from(crmActivities),
    ]);

    // Count last-30-day entries (current period)
    const [customersLast30, casesLast30] = await Promise.all([
      db.select({ count: count() }).from(crmCustomers).where(gte(crmCustomers.createdAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(crmCases).where(gte(crmCases.createdAt, thirtyDaysAgo)),
    ]);

    // Count previous-30-day entries (for comparison)
    const [customersPrev30, casesPrev30] = await Promise.all([
      db.select({ count: count() }).from(crmCustomers).where(
        and(gte(crmCustomers.createdAt, sixtyDaysAgo), lte(crmCustomers.createdAt, thirtyDaysAgo))
      ),
      db.select({ count: count() }).from(crmCases).where(
        and(gte(crmCases.createdAt, sixtyDaysAgo), lte(crmCases.createdAt, thirtyDaysAgo))
      ),
    ]);

    // Follow-ups due today or overdue
    const [followUpsToday] = await db.select({ count: count() }).from(crmCases).where(
      and(
        lte(crmCases.followUpDate, todayEnd),
        gte(crmCases.followUpDate, sql`'1970-01-01'::timestamp`),
        // Only open cases
        sql`${crmCases.status} NOT IN ('closed', 'archived', 'abgelehnt')`
      )
    );

    // Follow-ups due this week
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const [followUpsWeek] = await db.select({ count: count() }).from(crmCases).where(
      and(
        lte(crmCases.followUpDate, weekEnd),
        gte(crmCases.followUpDate, sql`'1970-01-01'::timestamp`),
        sql`${crmCases.status} NOT IN ('closed', 'archived', 'abgelehnt')`
      )
    );

    // Calculate trend percentages
    const calcTrend = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    const customersTrend = calcTrend(customersLast30[0]?.count || 0, customersPrev30[0]?.count || 0);
    const casesTrend = calcTrend(casesLast30[0]?.count || 0, casesPrev30[0]?.count || 0);

    return NextResponse.json({
      success: true,
      data: {
        customers: totalCustomers[0]?.count || 0,
        cases: totalCases[0]?.count || 0,
        activities: totalActivities[0]?.count || 0,
        // Trends (last 30 days vs previous 30 days)
        customersTrend,
        casesTrend,
        customersLast30: customersLast30[0]?.count || 0,
        casesLast30: casesLast30[0]?.count || 0,
        // Follow-ups
        followUpsToday: followUpsToday?.count || 0,
        followUpsWeek: followUpsWeek?.count || 0,
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
