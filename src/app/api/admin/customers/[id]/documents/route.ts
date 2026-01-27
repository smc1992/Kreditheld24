import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmDocuments, crmActivities } from '@/db';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;
    const documents = await db.select()
      .from(crmDocuments)
      .where(eq(crmDocuments.customerId, customerId));

    return NextResponse.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;
    const { name, type, fileUrl, fileSize } = await request.json();

    if (!name || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [newDoc] = await db.insert(crmDocuments)
      .values({
        customerId,
        name,
        type,
        fileUrl,
        fileSize,
        uploadedBy: session.user?.id as string,
      })
      .returning();

    // Automatische Aktivität loggen
    try {
      await db.insert(crmActivities).values({
        customerId,
        type: 'document',
        subject: `Dokument hochgeladen: ${name}`,
        description: `Ein neues Dokument wurde für den Kunden hinterlegt.`,
        date: new Date(),
        createdBy: session.user?.id as string
      });
    } catch (logError) {
      console.error('Failed to log document activity:', logError);
    }

    return NextResponse.json({
      success: true,
      data: newDoc
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
