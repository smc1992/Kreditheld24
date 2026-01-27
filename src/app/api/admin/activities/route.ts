import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmActivities } from '@/db';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');
    const customerId = searchParams.get('customerId');

    let query = db.select().from(crmActivities);
    
    if (caseId) {
      query = query.where(eq(crmActivities.caseId, caseId)) as any;
    } else if (customerId) {
      query = query.where(eq(crmActivities.customerId, customerId)) as any;
    }

    const activities = await query.orderBy(desc(crmActivities.date));

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
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

    const newActivity = await db
      .insert(crmActivities)
      .values({
        ...body,
        createdBy: session.user.id,
        date: body.date ? new Date(body.date) : new Date(),
      })
      .returning();

    return NextResponse.json({ success: true, data: newActivity[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
