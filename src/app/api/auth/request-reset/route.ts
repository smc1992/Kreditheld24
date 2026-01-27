import { NextResponse } from 'next/server';
import { db, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendPasswordReset } from '@/lib/email-notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse ist erforderlich.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Find customer
    const customer = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.email, normalizedEmail))
      .limit(1);

    // Always return success to prevent email enumeration
    if (customer.length === 0 || !customer[0].isActiveUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen des Passworts gesendet.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update customer with reset token
    await db.update(crmCustomers)
      .set({
        resetToken,
        resetTokenExpires,
        updatedAt: new Date(),
      })
      .where(eq(crmCustomers.id, customer[0].id));

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/reset-password?token=${resetToken}`;
    await sendPasswordReset({
      to: normalizedEmail,
      firstName: customer[0].firstName,
      resetUrl,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen des Passworts gesendet.' 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler.' },
      { status: 500 }
    );
  }
}
