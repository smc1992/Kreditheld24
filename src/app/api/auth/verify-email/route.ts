import { NextResponse } from 'next/server';
import { db, crmCustomers } from '@/db';
import { eq, and, gt } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token ist erforderlich.' },
        { status: 400 }
      );
    }

    // Find customer with this verification token
    const customer = await db
      .select()
      .from(crmCustomers)
      .where(
        and(
          eq(crmCustomers.emailVerificationToken, token),
          gt(crmCustomers.emailVerificationExpires, new Date())
        )
      )
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json(
        { error: 'Ungültiger oder abgelaufener Verifizierungslink.' },
        { status: 400 }
      );
    }

    // Update customer to mark email as verified
    await db.update(crmCustomers)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(crmCustomers.id, customer[0].id));

    return NextResponse.json({ 
      success: true, 
      message: 'Ihre E-Mail-Adresse wurde erfolgreich bestätigt!' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler bei der Verifizierung.' },
      { status: 500 }
    );
  }
}
