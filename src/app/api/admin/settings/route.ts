import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmSettings } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await db.query.crmSettings.findFirst({
      where: eq(crmSettings.id, 'system_config')
    });

    // Falls noch keine Einstellungen existieren, Default anlegen
    if (!settings) {
      [settings] = await db.insert(crmSettings).values({
        id: 'system_config',
        updatedAt: new Date()
      }).returning();
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const [updatedSettings] = await db.update(crmSettings)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(crmSettings.id, 'system_config'))
      .returning();

    return NextResponse.json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
