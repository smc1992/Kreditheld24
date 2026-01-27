import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmDocuments } from '@/db';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId, docId } = await params;

    await db.delete(crmDocuments)
      .where(
        and(
          eq(crmDocuments.id, docId),
          eq(crmDocuments.customerId, customerId)
        )
      );

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
