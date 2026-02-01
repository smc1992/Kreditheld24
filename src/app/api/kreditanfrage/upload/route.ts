import { NextRequest, NextResponse } from 'next/server';
import { db, crmDocuments, crmActivities, crmCases } from '@/db';
import { eq } from 'drizzle-orm';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { isTokenVerified, getVerificationData } from '../../../../lib/verification';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caseId = formData.get('caseId') as string;
    const documentType = formData.get('documentType') as string; // e.g., 'gehaltsabrechnung1'
    const verificationToken = formData.get('verificationToken') as string;

    if (!file || !caseId) {
      return NextResponse.json(
        { error: 'File and caseId are required' },
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
        // Ensure token belongs to the case
        if (tokenData?.formData?.caseId === caseId || (tokenData?.formData as any)?.caseId === caseId) {
          isAuthorized = true;
          console.log(`[Upload API] Authorized via token for caseId in metadata`);
        } else {
          console.warn(`[Upload API] Token caseId mismatch. Expected: ${caseId}, Token had: ${tokenData?.formData?.caseId}`);
        }
      }
    }

    // 2. Check Session (Portal Flow)
    if (!isAuthorized) {
      const session = await auth();
      if (session?.user?.id) {
        console.log(`[Upload API] Checking session for user: ${session.user.id}`);
        // Verify case belongs to user
        const userCase = await db.query.crmCases.findFirst({
          where: eq(crmCases.id, caseId),
          columns: { customerId: true }
        });

        if (userCase && userCase.customerId === session.user.id) {
          isAuthorized = true;
          console.log(`[Upload API] Authorized via session`);
        } else {
          console.warn(`[Upload API] Authorization failed: Case ${caseId} does not belong to user ${session.user.id}`);
        }
      }
    }

    if (!isAuthorized) {
      console.error(`[Upload API] Final authorization check failed for caseId: ${caseId}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Verify case exists
    const existingCase = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, caseId),
      with: {
        customer: true
      }
    });

    if (!existingCase) {
      console.error(`[Upload API] Case not found: ${caseId}`);
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // 2. Save file to disk
    const publicUrl = await saveFile(file, 'kreditanfragen');
    console.log(`[Upload API] File saved via utility: ${publicUrl}`);
    console.log(`[Upload API] File saved: ${filePath}`);

    // 3. Create CRM Document record
    try {
      const [newDoc] = await db.insert(crmDocuments).values({
        caseId: caseId,
        customerId: existingCase.customerId,
        name: file.name, // Display name
        type: file.type || 'application/octet-stream',
        fileUrl: publicUrl,
        fileSize: file.size,
        createdAt: new Date(),
      }).returning();
      console.log(`[Upload API] CRM Document created: ${newDoc.id}`);

      // 4. Log Activity (triggers Admin Notification via 'document' type)
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
      return NextResponse.json({ error: 'Failed to record document in database' }, { status: 500 });
    }
  } catch (error) {
    console.error('[Upload API] Critical error:', error);
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}
