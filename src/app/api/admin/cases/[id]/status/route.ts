import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCases } from '@/db';
import { eq } from 'drizzle-orm';
import { sendCaseStatusChange } from '@/lib/email-notifications';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: caseId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status ist erforderlich.' },
        { status: 400 }
      );
    }

    // Get current case data with customer info
    const currentCase = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, caseId),
      with: {
        customer: true,
      },
    });

    if (!currentCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const oldStatus = currentCase.status || 'draft';

    // Update case status
    await db.update(crmCases)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(crmCases.id, caseId));

    // Send email notification if customer has verified email and status changed
    if (
      currentCase.customer?.email && 
      currentCase.customer?.emailVerified &&
      oldStatus !== status
    ) {
      const caseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/cases/${caseId}`;
      await sendCaseStatusChange({
        to: currentCase.customer.email,
        firstName: currentCase.customer.firstName,
        caseNumber: currentCase.caseNumber,
        oldStatus,
        newStatus: status,
        caseUrl,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Status erfolgreich aktualisiert.',
      notificationSent: currentCase.customer?.emailVerified || false
    });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler beim Aktualisieren des Status.' },
      { status: 500 }
    );
  }
}
