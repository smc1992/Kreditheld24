import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappSettings } from '@/db';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// Default settings
const DEFAULT_SETTINGS: Record<string, string> = {
  system_prompt: `Du bist der KI-Assistent von Kreditheld24, einem führenden Kreditvermittler in Deutschland.
Du antwortest professionell, freundlich und auf Deutsch über WhatsApp.

Deine Aufgaben:
- Beantworte allgemeine Fragen zu Krediten, Finanzierungen und Darlehen
- Erkläre Prozesse und Abläufe der Kreditvermittlung
- Hilf Kunden bei der Vorbereitung ihrer Unterlagen
- Leite bei spezifischen Anfragen an einen menschlichen Berater weiter

Wichtige Regeln:
- Halte Antworten kurz und WhatsApp-gerecht (max. 3-4 Absätze)
- Verwende passende Emojis sparsam
- Gib KEINE konkreten Zinssätze oder Konditionen
- Bei Kreditanfragen: Frage nach Betrag, Laufzeit und Verwendungszweck
- Weise bei komplexen Fragen darauf hin, dass ein Berater sich melden wird`,
  model: 'gpt-4o-mini',
  temperature: '0.7',
  global_ai_enabled: 'true',
  credit_keywords: JSON.stringify([
    'kredit', 'darlehen', 'finanzierung', 'baufinanzierung', 'umschuldung',
    'ratenkredit', 'autokredit', 'immobilienkredit', 'hypothek',
    'kreditanfrage', 'kredit beantragen', 'kredit aufnehmen',
    'wieviel kredit', 'wie viel kredit', 'kreditbetrag',
    'monatliche rate', 'zinsen', 'tilgung',
    'ich brauche geld', 'geld leihen', 'brauche einen kredit',
    'finanzieren', 'kreditberatung', 'beratungstermin',
  ]),
};

// GET - Load all settings
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await db.select().from(whatsappSettings);
    
    // Merge defaults with DB values
    const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('[WhatsApp Settings] GET error:', error);
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
    }

    // Upsert each setting
    for (const [key, value] of Object.entries(settings)) {
      if (typeof value !== 'string') continue;
      
      const existing = await db.select().from(whatsappSettings).where(eq(whatsappSettings.key, key)).limit(1);
      
      if (existing.length > 0) {
        await db.update(whatsappSettings)
          .set({ value, updatedAt: new Date() })
          .where(eq(whatsappSettings.key, key));
      } else {
        await db.insert(whatsappSettings).values({ key, value });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Settings] PUT error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
