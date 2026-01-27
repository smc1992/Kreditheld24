import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCases, crmCustomers } from '@/db';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    const cases = customerId
      ? await db
          .select({
            case: crmCases,
            customer: crmCustomers,
          })
          .from(crmCases)
          .leftJoin(crmCustomers, eq(crmCases.customerId, crmCustomers.id))
          .where(eq(crmCases.customerId, customerId))
          .orderBy(desc(crmCases.createdAt))
      : await db
          .select({
            case: crmCases,
            customer: crmCustomers,
          })
          .from(crmCases)
          .leftJoin(crmCustomers, eq(crmCases.customerId, crmCustomers.id))
          .orderBy(desc(crmCases.createdAt));

    return NextResponse.json({ success: true, data: cases });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const newCase = await db
      .insert(crmCases)
      .values({
        ...body,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
      })
      .returning();

    return NextResponse.json({ success: true, data: newCase[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
