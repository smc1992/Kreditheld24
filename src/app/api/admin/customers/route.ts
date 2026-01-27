import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers } from '@/db';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customers = await db
      .select()
      .from(crmCustomers)
      .orderBy(desc(crmCustomers.createdAt));

    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
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

    const newCustomer = await db
      .insert(crmCustomers)
      .values({
        ...body,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
      })
      .returning();

    return NextResponse.json({ success: true, data: newCustomer[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
