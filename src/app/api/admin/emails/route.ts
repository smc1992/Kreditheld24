import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmEmails } from '@/db';
import { desc, eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'inbox'; // inbox, sent, trash
    const customerId = searchParams.get('customerId');

    let query = db.select().from(crmEmails);

    if (folder === 'inbox') {
      query = query.where(eq(crmEmails.direction, 'inbound')) as any;
    } else if (folder === 'sent') {
      query = query.where(eq(crmEmails.direction, 'outbound')) as any;
    }

    if (customerId) {
      query = query.where(and(
        eq(crmEmails.customerId, customerId),
        // Additional folder filters if needed
      )) as any;
    }

    const emails = await query.orderBy(desc(crmEmails.date));

    return NextResponse.json({ success: true, data: emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
