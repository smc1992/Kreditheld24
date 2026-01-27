import { NextResponse } from 'next/server';
import { db, interestRates } from '@/db';
import { desc, eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const kreditart = searchParams.get('kreditart');

    const conditions = [];
    if (source) {
      conditions.push(eq(interestRates.source, source));
    }
    if (kreditart) {
      conditions.push(eq(interestRates.kreditart, kreditart));
    }

    const rates = await db
      .select()
      .from(interestRates)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(interestRates.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      data: rates,
      count: rates.length,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newRate = await db.insert(interestRates).values(body).returning();

    return NextResponse.json({
      success: true,
      data: newRate[0],
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create rate' },
      { status: 500 }
    );
  }
}
