import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmSettings } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const settings = await db.select().from(crmSettings).where(eq(crmSettings.id, 'system_config')).limit(1);

        // Default signature if none exists
        const defaultSignature = `
      <br><br>
      --<br>
      <strong>Kreditheld24 Team</strong><br>
      Kreditheld24 GmbH<br>
      Musterstraße 123, 10115 Berlin<br>
      <a href="https://kreditheld24.de">www.kreditheld24.de</a>
    `;

        return NextResponse.json({
            success: true,
            signature: settings[0]?.signature || defaultSignature
        });
    } catch (error) {
        console.error('Error fetching signature:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { signature } = await req.json();

        await db.insert(crmSettings)
            .values({ id: 'system_config', signature: signature })
            .onConflictDoUpdate({
                target: crmSettings.id,
                set: { signature: signature, updatedAt: new Date() }
            });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving signature:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
