import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const customer = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.id, session.user.id))
      .limit(1);

    if (!customer.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer[0] });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, street, houseNumber, postalCode, city } = body;

    const [updatedCustomer] = await db
      .update(crmCustomers)
      .set({
        firstName,
        lastName,
        email,
        phone,
        address: street && houseNumber ? `${street} ${houseNumber}, ${postalCode} ${city}` : null,
        updatedAt: new Date(),
      })
      .where(eq(crmCustomers.id, session.user.id))
      .returning();

    return NextResponse.json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
