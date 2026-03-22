import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, chatSessions, crmCustomers } from '@/db';
import { eq, or, ilike } from 'drizzle-orm';

// PATCH - Assign a CRM customer to this chat session
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
    }

    // Verify customer exists
    const [customer] = await db.select().from(crmCustomers).where(eq(crmCustomers.id, customerId)).limit(1);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Update session
    const [updated] = await db.update(chatSessions)
      .set({ customerId, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      session: updated,
      customer: { firstName: customer.firstName, lastName: customer.lastName, email: customer.email }
    });
  } catch (error) {
    console.error('Error assigning customer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET - Search customers for assignment dropdown
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (q.length < 2) {
      return NextResponse.json({ success: true, customers: [] });
    }

    const customers = await db.select({
      id: crmCustomers.id,
      firstName: crmCustomers.firstName,
      lastName: crmCustomers.lastName,
      email: crmCustomers.email,
    })
      .from(crmCustomers)
      .where(
        or(
          ilike(crmCustomers.firstName, `%${q}%`),
          ilike(crmCustomers.lastName, `%${q}%`),
          ilike(crmCustomers.email, `%${q}%`)
        )
      )
      .limit(10);

    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Error searching customers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
