import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers } from '@/db';
import { desc, like, or, sql, ilike } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let whereClause = undefined;
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      whereClause = or(
        ilike(crmCustomers.firstName, searchLower),
        ilike(crmCustomers.lastName, searchLower),
        ilike(crmCustomers.email, searchLower)
      );
    }

    // Get total count
    const totalCountRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(crmCustomers)
      .where(whereClause);
    const total = Number(totalCountRes[0].count);

    const customers = await db
      .select()
      .from(crmCustomers)
      .where(whereClause)
      .orderBy(desc(crmCustomers.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
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
