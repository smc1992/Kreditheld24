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

    // Get document with case info
    const document = await db.query.crmDocuments.findFirst({
      where: eq(crmDocuments.id, documentId),
      with: {
        case: true
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify the document belongs to the user's case
    if (document.case?.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete file from filesystem
    try {
      const filePath = path.join(process.cwd(), 'public', document.fileUrl);
      await unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue even if file deletion fails
    }

    // Delete document record from database
    await db.delete(crmDocuments).where(eq(crmDocuments.id, documentId));

    return NextResponse.json({ success: true, message: 'Dokument erfolgreich gelöscht.' });
  } catch (error) {
    console.error('Document deletion error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler beim Löschen des Dokuments.' },
      { status: 500 }
    );
  }
}
