import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCases } from '@/db';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow customers to access their own cases
    if (session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const cases = await db
      .select()
      .from(crmCases)
      .where(eq(crmCases.customerId, session.user.id))
      .orderBy(desc(crmCases.createdAt));

    return NextResponse.json({ success: true, data: cases });
  } catch (error) {
    console.error('Error fetching customer cases:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cases' }, { status: 500 });
  }
}
