import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmDocuments } from '@/db';
import { eq, desc, and } from 'drizzle-orm';
import { saveFile } from '@/lib/file-upload';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow customers to access their own documents
    if (session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const documents = await db
      .select()
      .from(crmDocuments)
      .where(and(
        eq(crmDocuments.customerId, session.user.id),
        eq(crmDocuments.isDeletedByCustomer, false)
      ))
      .orderBy(desc(crmDocuments.createdAt));

    // Map database fields to camelCase for frontend
    const mappedDocuments = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type || 'other',
      fileSize: doc.fileSize || 0,
      fileUrl: doc.fileUrl,
      createdAt: doc.createdAt,
      caseId: doc.caseId || undefined,
    }));

    return NextResponse.json({ success: true, data: mappedDocuments });
  } catch (error) {
    console.error('Error fetching customer documents:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const caseId = formData.get('caseId') as string | null;
    const documentType = formData.get('type') as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedDocuments = [];

    for (const file of files) {
      // Save file to disk in portal subfolder
      const fileUrl = await saveFile(file, 'portal');

      // Save metadata to database
      const [document] = await db
        .insert(crmDocuments)
        .values({
          customerId: session.user.id,
          caseId: caseId || null,
          name: file.name,
          type: documentType || 'other',
          fileUrl: fileUrl,
          fileSize: file.size,
        })
        .returning();

      // Map to camelCase for frontend
      uploadedDocuments.push({
        id: document.id,
        name: document.name,
        type: document.type || 'other',
        fileSize: document.fileSize || 0,
        fileUrl: document.fileUrl,
        createdAt: document.createdAt,
        caseId: document.caseId || undefined,
      });
    }

    return NextResponse.json({
      success: true,
      data: uploadedDocuments,
      message: `${uploadedDocuments.length} document(s) uploaded successfully`
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload documents' }, { status: 500 });
  }
}
