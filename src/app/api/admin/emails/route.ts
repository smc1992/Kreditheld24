import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmEmails } from '@/db';
import { desc, eq, and, ne } from 'drizzle-orm';
import { fetchRecentEmails } from '@/lib/imap';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Fetch single email by ID (from DB)
    if (id) {
      try {
        const email = await db.select().from(crmEmails).where(eq(crmEmails.id, id)).limit(1);
        if (email.length > 0) {
          return NextResponse.json({ success: true, data: email[0] });
        }
        return NextResponse.json({ success: false, error: 'Email not found' }, { status: 404 });
      } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
      }
    }

    const folder = searchParams.get('folder') || 'inbox'; // inbox, sent, trash

    // For Inbox, we fetch directly from IMAP to show live emails
    if (folder === 'inbox') {
      try {
        const liveEmails = await fetchRecentEmails('INBOX', 20);
        return NextResponse.json({ success: true, data: liveEmails });
      } catch (imapError) {
        console.error('IMAP Error in route:', imapError);
        return NextResponse.json({ success: false, error: 'Failed to fetch emails from IMAP' }, { status: 500 });
      }
    }

    // Sent items (DB Source of Truth for CRM)
    if (folder === 'sent') {
      try {
        const sentEmails = await db.select().from(crmEmails)
          .where(eq(crmEmails.direction, 'outbound'))
          .orderBy(desc(crmEmails.date));

        const formattedEmails = sentEmails.map(email => ({
          id: email.id,
          // For sent items, the 'recipient' is usually what we display in the list
          recipient: email.to,
          sender: email.from,
          subject: email.subject,
          // Strip HTML for preview
          preview: email.textContent || (email.htmlContent ? email.htmlContent.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : ''),
          htmlContent: email.htmlContent,
          date: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
          status: 'read',
          hasAttachment: email.hasAttachments || false,
          starred: email.starred || false
        }));

        return NextResponse.json({ success: true, data: formattedEmails });
      } catch (dbError) {
        console.error('Error fetching sent emails from DB:', dbError);
        return NextResponse.json({ success: false, data: [] });
      }
    }

    // Trash items
    if (folder === 'trash') {
      try {
        const trashEmails = await db.select().from(crmEmails)
          .where(eq(crmEmails.status, 'trash'))
          .orderBy(desc(crmEmails.date));

        const formattedEmails = trashEmails.map(email => ({
          id: email.id,
          recipient: email.to,
          sender: email.from,
          subject: email.subject,
          preview: email.htmlContent ? email.htmlContent.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : '',
          htmlContent: email.htmlContent,
          date: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
          status: 'read',
          hasAttachment: email.hasAttachments || false,
          starred: email.starred || false
        }));

        return NextResponse.json({ success: true, data: formattedEmails });
      } catch (dbError) {
        console.error('Error fetching trash emails from DB:', dbError);
        return NextResponse.json({ success: false, data: [] });
      }
    }

    return NextResponse.json({ success: true, data: [] });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
