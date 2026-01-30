import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmDocuments } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { saveFile } from '@/lib/file-upload';

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
      .where(eq(crmDocuments.customerId, session.user.id))
      .orderBy(desc(crmDocuments.createdAt));

    return NextResponse.json({ success: true, data: documents });
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
      // Save file to disk
      const fileUrl = await saveFile(file);
      
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

      uploadedDocuments.push(document);
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
