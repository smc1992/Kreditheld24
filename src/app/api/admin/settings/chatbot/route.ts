import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

// Simple key-value store in admin_settings table or fallback to JSON file
// For now, use a simple approach: store in admin_settings jsonb

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get chatbot settings from admin_settings
    const result = await db.execute(sql`
      SELECT value FROM admin_settings WHERE key = 'chatbot_config' LIMIT 1
    `);

    const config = (result as any).rows?.[0]?.value || {
      systemPrompt: `Du bist der hilfreiche KI-Assistent von Kreditheld24.
Antworte freundlich, professionell und auf Deutsch.
Deine Aufgabe ist es, Kunden bei Kreditfragen zu unterstützen.`,
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      quickReplies: [
        'Vielen Dank für Ihre Nachricht! Ein Berater meldet sich in Kürze bei Ihnen.',
        'Haben Sie Ihre Unterlagen bereits hochgeladen? Sie können dies im Portal unter "Dokumente" tun.',
        'Für eine individuelle Beratung empfehle ich Ihnen, einen Termin mit unserem Team zu vereinbaren.',
        'Ihre Anfrage wird bearbeitet. Bei dringenden Fragen erreichen Sie uns telefonisch.',
        'Vielen Dank für Ihr Interesse! Ich leite Sie an einen Berater weiter.',
      ],
      escalationMinutes: 10,
    };

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching chatbot config:', error);
    // Return defaults if table doesn't exist
    return NextResponse.json({
      success: true,
      config: {
        systemPrompt: `Du bist der hilfreiche KI-Assistent von Kreditheld24.
Antworte freundlich, professionell und auf Deutsch.
Deine Aufgabe ist es, Kunden bei Kreditfragen zu unterstützen.`,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        quickReplies: [
          'Vielen Dank für Ihre Nachricht! Ein Berater meldet sich in Kürze bei Ihnen.',
          'Haben Sie Ihre Unterlagen bereits hochgeladen?',
          'Für eine individuelle Beratung vereinbaren Sie bitte einen Termin.',
          'Ihre Anfrage wird bearbeitet. Bei dringenden Fragen erreichen Sie uns telefonisch.',
          'Vielen Dank! Ich leite Sie an einen Berater weiter.',
        ],
        escalationMinutes: 10,
      }
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await request.json();

    // Upsert chatbot config
    await db.execute(sql`
      INSERT INTO admin_settings (key, value, updated_at)
      VALUES ('chatbot_config', ${JSON.stringify(config)}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(config)}::jsonb, updated_at = NOW()
    `);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving chatbot config:', error);
    return NextResponse.json({ success: false, error: 'Failed to save config' }, { status: 500 });
  }
}
