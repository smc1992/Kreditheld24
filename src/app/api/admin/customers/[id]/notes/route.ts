import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;
    const { notes } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    await db.update(crmCustomers)
      .set({ 
        notes,
        updatedAt: new Date()
      })
      .where(eq(crmCustomers.id, customerId));

    return NextResponse.json({
      success: true,
      message: 'Notes updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notes' },
      { status: 500 }
    );
  }
}
