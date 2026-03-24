import { NextRequest, NextResponse } from 'next/server';
import { db, crmDocuments, crmActivities, crmCases } from '@/db';
import { eq } from 'drizzle-orm';
import { isTokenVerified, getVerificationData } from '../../../../lib/verification';
import { auth } from '@/lib/auth';
import { saveFile } from '@/lib/file-upload';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const documentType = formData.get('documentType') as string;
    const verificationToken = formData.get('verificationToken') as string;

    if (!file || !caseId) {
      return NextResponse.json(
        { error: 'Datei und Vorgangs-ID sind erforderlich.' },
        { status: 400 }
      );
    }

    // Security Check: Verify authorization via Token or Session
    let isAuthorized = false;

    console.log(`[Upload API] Starting upload for caseId: ${caseId}, docType: ${documentType}`);

    // 1. Check Verification Token (Public Flow)
    if (verificationToken) {
      const verified = await isTokenVerified(verificationToken);
      console.log(`[Upload API] Token verification status: ${verified}`);
      if (verified) {
        const tokenData = await getVerificationData(verificationToken);
        // Check if token caseId matches, OR if the email matches the case owner
        const tokenCaseId = (tokenData?.formData as any)?.caseId;
        if (tokenCaseId === caseId) {
          isAuthorized = true;
          console.log(`[Upload API] Authorized via token (caseId match)`);
        } else if (tokenData?.email) {
          // Fallback: Prüfe ob die E-Mail im Token zum Case-Besitzer passt
          const existingCase = await db.query.crmCases.findFirst({
            where: eq(crmCases.id, caseId),
            with: { customer: true }
          });
          if (existingCase?.customer?.email === tokenData.email) {
            isAuthorized = true;
            console.log(`[Upload API] Authorized via token (email match)`);
          } else {
            console.warn(`[Upload API] Token email mismatch. Token email: ${tokenData.email}, Case customer email: ${existingCase?.customer?.email}`);
          }
        } else {
          console.warn(`[Upload API] Token caseId mismatch. Expected: ${caseId}, Token had: ${tokenCaseId}`);
        }
      } else {
        console.warn(`[Upload API] Token nicht verifiziert oder abgelaufen.`);
      }
    }

    // 2. Check Session (Portal Flow)
    if (!isAuthorized) {
      const session = await auth();
      if (session?.user?.id) {
        console.log(`[Upload API] Checking session for user: ${session.user.id}`);
        const userCase = await db.query.crmCases.findFirst({
          where: eq(crmCases.id, caseId),
          columns: { customerId: true }
        });

        if (userCase && userCase.customerId === session.user.id) {
          isAuthorized = true;
          console.log(`[Upload API] Authorized via session`);
        } else {
          console.warn(`[Upload API] Session auth failed: Case ${caseId} does not belong to user ${session.user.id}`);
        }
      }
    }

    if (!isAuthorized) {
      console.error(`[Upload API] Authorization failed for caseId: ${caseId}`);
      return NextResponse.json(
        { error: 'Nicht autorisiert. Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse oder loggen Sie sich erneut ein.' },
        { status: 403 }
      );
    }

    // Verify case exists
    const existingCase = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, caseId),
      with: { customer: true }
    });

    if (!existingCase) {
      console.error(`[Upload API] Case not found: ${caseId}`);
      return NextResponse.json(
        { error: 'Vorgang nicht gefunden. Bitte laden Sie die Seite neu.' },
        { status: 404 }
      );
    }

    // Save file to disk
    const publicUrl = await saveFile(file, 'kreditanfragen');
    console.log(`[Upload API] File saved: ${publicUrl}`);

    // Create CRM Document record
    try {
      const [newDoc] = await db.insert(crmDocuments).values({
        caseId: caseId,
        customerId: existingCase.customerId,
        name: file.name,
        type: file.type || 'application/octet-stream',
        fileUrl: publicUrl,
        fileSize: file.size,
        createdAt: new Date(),
      }).returning();
      console.log(`[Upload API] CRM Document created: ${newDoc.id}`);

      // Log Activity
      await db.insert(crmActivities).values({
        caseId: caseId,
        customerId: existingCase.customerId,
        type: 'document',
        subject: 'Dokument hochgeladen',
        description: `Kunde hat ein Dokument hochgeladen: ${file.name} (${documentType})`,
        date: new Date(),
      });

      return NextResponse.json({ success: true, data: newDoc });
    } catch (dbErr) {
      console.error(`[Upload API] Database insertion error:`, dbErr);
      return NextResponse.json(
        { error: 'Dokument konnte nicht in der Datenbank gespeichert werden.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Upload API] Critical error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler beim Hochladen. Bitte versuchen Sie es erneut.' },
      { status: 500 }
    );
  }
}
