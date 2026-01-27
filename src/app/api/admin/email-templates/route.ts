import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, emailTemplates, crmActivities } from '@/db';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await db.select().from(emailTemplates).orderBy(desc(emailTemplates.updatedAt));
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const [newTemplate] = await db.insert(emailTemplates).values({
      name: body.name,
      subject: body.subject,
      content: body.content,
      category: body.category || 'custom',
    }).returning();

    // Aktivität loggen
    try {
      await db.insert(crmActivities).values({
        type: 'system',
        subject: 'E-Mail Template erstellt',
        description: `Neues Template "${body.name}" wurde angelegt.`,
        date: new Date(),
        createdBy: session.user.id
      });
    } catch (logError) {
      console.error('Failed to log template activity:', logError);
    }

    return NextResponse.json({ success: true, data: newTemplate });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json({ success: false, error: 'Failed to create template' }, { status: 500 });
  }
}
