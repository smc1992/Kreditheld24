import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, emailTemplates, crmActivities } from '@/db';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: templateId } = await params;

    // Hole Template-Name für das Log bevor es gelöscht wird
    const template = await db.query.emailTemplates.findFirst({
      where: eq(emailTemplates.id, templateId)
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    await db.delete(emailTemplates).where(eq(emailTemplates.id, id));

    // Aktivität loggen
    try {
      await db.insert(crmActivities).values({
        type: 'system',
        subject: 'E-Mail Template gelöscht',
        description: `Das Template "${template.name}" wurde entfernt.`,
        date: new Date(),
        createdBy: session.user.id
      });
    } catch (logError) {
      console.error('Failed to log template deletion activity:', logError);
    }

    return NextResponse.json({ success: true, message: 'Template deleted' });
  } catch (error) {
    console.error('Error deleting email template:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete template' }, { status: 500 });
  }
}
