import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCustomers } from '@/db';
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

    const { id: customerId } = await params;

    const customer = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.id, customerId))
      .limit(1);

    if (!customer.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;
    const body = await request.json();

    const updatedCustomer = await db
      .update(crmCustomers)
      .set({
        ...body,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        updatedAt: new Date(),
      })
      .where(eq(crmCustomers.id, customerId))
      .returning();

    return NextResponse.json({ success: true, data: updatedCustomer[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;
    const body = await request.json();

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only include fields that are provided
    if (body.firstName !== undefined) updateData.firstName = body.firstName;
    if (body.lastName !== undefined) updateData.lastName = body.lastName;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.street !== undefined) updateData.street = body.street;
    if (body.city !== undefined) updateData.city = body.city;
    if (body.zipCode !== undefined) updateData.zipCode = body.zipCode;
    if (body.country !== undefined) updateData.country = body.country;
    if (body.dateOfBirth !== undefined) updateData.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null;
    if (body.nationality !== undefined) updateData.nationality = body.nationality;
    if (body.maritalStatus !== undefined) updateData.maritalStatus = body.maritalStatus;
    if (body.numberOfChildren !== undefined) updateData.numberOfChildren = body.numberOfChildren;
    if (body.occupation !== undefined) updateData.occupation = body.occupation;
    if (body.employer !== undefined) updateData.employer = body.employer;
    if (body.monthlyIncome !== undefined) updateData.monthlyIncome = body.monthlyIncome;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updatedCustomer = await db
      .update(crmCustomers)
      .set(updateData)
      .where(eq(crmCustomers.id, customerId))
      .returning();

    if (!updatedCustomer.length) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCustomer[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: customerId } = await params;

    await db.delete(crmCustomers).where(eq(crmCustomers.id, customerId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
