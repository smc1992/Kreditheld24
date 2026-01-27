import { NextRequest, NextResponse } from 'next/server';
import { db, crmCases } from '@/db';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest) {
  try {
    const { caseId, formData, currentStep } = await request.json();

    if (!caseId) {
      return NextResponse.json({ error: 'Case ID fehlt' }, { status: 400 });
    }

    // CRM Case aktualisieren
    await db.update(crmCases)
      .set({
        formData,
        currentStep,
        updatedAt: new Date(),
        // Ggf. wichtige Felder direkt aus dem form_data mappen für die Übersicht
        requestedAmount: formData.kreditsumme ? formData.kreditsumme.toString() : undefined,
        bank: formData.bank || undefined,
        duration: formData.laufzeit ? parseInt(formData.laufzeit) : undefined,
      })
      .where(eq(crmCases.id, caseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Zwischenspeichern der Kreditanfrage:', error);
    return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
  }
}
