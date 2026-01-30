import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCases, crmDocuments } from '@/db';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: caseId } = await params;

    // Fetch case ensuring it belongs to the logged-in customer
    const kase = await db.query.crmCases.findFirst({
      where: and(
        eq(crmCases.id, caseId),
        eq(crmCases.customerId, session.user.id)
      ),
    });

    if (!kase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Fetch documents for this case
    const documents = await db.query.crmDocuments.findMany({
      where: and(
        eq(crmDocuments.caseId, caseId),
        eq(crmDocuments.isDeletedByCustomer, false)
      ),
      orderBy: [desc(crmDocuments.createdAt)],
    });

    return NextResponse.json({
      success: true,
      case: kase,
      documents
    });
  } catch (error) {
    console.error('Error fetching portal case details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
