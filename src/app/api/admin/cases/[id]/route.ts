import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCases, crmCustomers, crmActivities } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: caseId } = await params;

    const result = await db
      .select({
        case: crmCases,
        customer: crmCustomers,
      })
      .from(crmCases)
      .leftJoin(crmCustomers, eq(crmCases.customerId, crmCustomers.id))
      .where(eq(crmCases.id, caseId))
      .where(eq(crmCases.id, params.id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const caseData = {
      ...result[0].case,
      customer: result[0].customer,
    };

    return NextResponse.json({ success: true, data: caseData });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch case' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Hole den aktuellen Stand für das Log
    const currentCase = await db.query.crmCases.findFirst({
      where: eq(crmCases.id, params.id)
    });

    if (!currentCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const updatedCase = await db
      .update(crmCases)
      .set({
        caseNumber: body.caseNumber,
        advisorName: body.advisorName,
        advisorNumber: body.advisorNumber,
        requestedAmount: body.requestedAmount,
        approvedAmount: body.approvedAmount,
        bank: body.bank,
        duration: body.duration ? parseInt(body.duration) : null,
        status: body.status,
        formData: body.formData,
        currentStep: body.currentStep,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(crmCases.id, params.id))
      .returning();

    // Automatische Aktivität loggen bei wichtigen Änderungen
    const changes = [];
    if (body.caseNumber && body.caseNumber !== currentCase.caseNumber) {
      changes.push(`Vorgangsnummer geändert: ${currentCase.caseNumber} ➔ ${body.caseNumber}`);
    }
    if (body.status && body.status !== currentCase.status) {
      changes.push(`Status geändert: ${currentCase.status} ➔ ${body.status}`);
    }

    if (changes.length > 0) {
      try {
        await db.insert(crmActivities).values({
          caseId: params.id,
          customerId: currentCase.customerId,
          type: 'system',
          subject: 'Vorgang bearbeitet',
          description: changes.join(', '),
          date: new Date(),
          createdBy: session.user.id
        });
      } catch (logError) {
        console.error('Failed to log case activity:', logError);
      }
    }

    return NextResponse.json({ success: true, data: updatedCase[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.delete(crmCases).where(eq(crmCases.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}
