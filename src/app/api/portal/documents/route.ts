import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmDocuments } from '@/db';
import { eq, desc } from 'drizzle-orm';

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

    // TODO: Implement file upload logic
    // This would require file storage setup (e.g., S3, local storage)
    
    return NextResponse.json({ 
      success: false, 
      error: 'File upload not yet implemented' 
    }, { status: 501 });
  } catch (error) {
    console.error('Error uploading documents:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload documents' }, { status: 500 });
  }
}
