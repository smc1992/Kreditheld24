import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmDocuments, crmCases } from '@/db';
import { eq, and } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: documentId } = await params;

    // Get document
    const [document] = await db
      .select()
      .from(crmDocuments)
      .where(eq(crmDocuments.id, documentId))
      .limit(1);

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify the document belongs to the user
    if (document.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Soft Delete: Mark as deleted by customer but keep record and file
    await db.update(crmDocuments)
      .set({ isDeletedByCustomer: true })
      .where(eq(crmDocuments.id, documentId));

    return NextResponse.json({ success: true, message: 'Dokument erfolgreich entfernt.' });
  } catch (error) {
    console.error('Document deletion error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler beim Löschen des Dokuments.' },
      { status: 500 }
    );
  }
}
