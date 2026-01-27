import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmDocuments } from '@/db';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('caseId');

    const documents = caseId
      ? await db
          .select()
          .from(crmDocuments)
          .where(eq(crmDocuments.caseId, caseId))
          .orderBy(desc(crmDocuments.createdAt))
      : await db.select().from(crmDocuments).orderBy(desc(crmDocuments.createdAt));

    return NextResponse.json({ success: true, data: documents });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
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

    const newDocument = await db
      .insert(crmDocuments)
      .values({
        ...body,
        uploadedBy: session.user.id,
      })
      .returning();

    return NextResponse.json({ success: true, data: newDocument[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
