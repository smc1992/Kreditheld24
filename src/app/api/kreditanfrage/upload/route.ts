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

    // 1. Check Verification Token (Public Flow)
    if (verificationToken) {
      const verified = await isTokenVerified(verificationToken);
      if (verified) {
        const tokenData = await getVerificationData(verificationToken);
        // Ensure token belongs to the case (simple check via stored form data if available, or just trust token for draft phase)
        // Ideally we store caseId in token data. We do store it in send-verification route.
        if (tokenData?.formData?.caseId === caseId) {
          isAuthorized = true;
        } else {
           // Fallback: If token doesn't have caseId explicitly (older tokens), we might still allow if email matches case
           // For now, strict check on caseId in token data is safer if available.
           // If caseId was passed in token creation, it should match.
           if ((tokenData?.formData as any)?.caseId === caseId) {
             isAuthorized = true;
           }
        }
      }
    }

    // 2. Check Session (Portal Flow)
    if (!isAuthorized) {
      const session = await auth();
      if (session?.user?.id) {
        // Verify case belongs to user
        const userCase = await db.query.crmCases.findFirst({
          where: eq(crmCases.id, caseId),
          columns: { customerId: true }
        });
        
        if (userCase && userCase.customerId === session.user.id) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
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
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // 2. Save file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'kreditanfragen');
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    // Generate unique filename
    const fileExt = path.extname(file.name);
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const uniqueFilename = `${caseId}-${documentType}-${uniqueId}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    const publicUrl = `/uploads/kreditanfragen/${uniqueFilename}`;

    await writeFile(filePath, buffer);

    // 3. Create CRM Document record
    const [newDoc] = await db.insert(crmDocuments).values({
      caseId: caseId,
      customerId: existingCase.customerId,
      name: file.name, // Display name
      type: file.type || 'application/octet-stream',
      fileUrl: publicUrl,
      fileSize: file.size,
      createdAt: new Date(),
    }).returning();

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
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}
