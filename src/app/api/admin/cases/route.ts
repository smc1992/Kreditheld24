import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCases, crmCustomers } from '@/db';
import { desc, eq, and, or, ilike, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let whereClause = customerId ? eq(crmCases.customerId, customerId) : undefined;

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      const searchCondition = or(
        ilike(crmCases.caseNumber, searchLower),
        ilike(crmCases.bank, searchLower),
        ilike(crmCustomers.firstName, searchLower),
        ilike(crmCustomers.lastName, searchLower)
      );
      whereClause = whereClause ? and(whereClause, searchCondition) : searchCondition;
    }

    // Get total count
    const totalCountRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(crmCases)
      .leftJoin(crmCustomers, eq(crmCases.customerId, crmCustomers.id))
      .where(whereClause);
    const total = Number(totalCountRes[0].count);

    const cases = await db
      .select({
        case: crmCases,
        customer: crmCustomers,
      })
      .from(crmCases)
      .leftJoin(crmCustomers, eq(crmCases.customerId, crmCustomers.id))
      .where(whereClause)
      .orderBy(desc(crmCases.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: cases,
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
