import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers, crmCases } from '@/db';
import { ilike, or, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, data: { customers: [], cases: [] } });
    }

    // Search Customers
    const customers = await db.select().from(crmCustomers)
      .where(or(
        ilike(crmCustomers.firstName, `%${query}%`),
        ilike(crmCustomers.lastName, `%${query}%`),
        ilike(crmCustomers.email, `%${query}%`)
      ))
      .limit(5);

    // Search Cases
    const cases = await db.select().from(crmCases)
      .where(or(
        ilike(crmCases.caseNumber, `%${query}%`),
        ilike(crmCases.bank, `%${query}%`)
      ))
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        customers,
        cases
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
