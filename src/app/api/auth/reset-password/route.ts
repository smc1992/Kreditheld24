import { NextResponse } from 'next/server';
import { db, crmCustomers } from '@/db';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token und Passwort sind erforderlich.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 8 Zeichen lang sein.' },
        { status: 400 }
      );
    }

    // Find customer with valid reset token
    const customer = await db
      .select()
      .from(crmCustomers)
      .where(
        and(
          eq(crmCustomers.resetToken, token),
          gt(crmCustomers.resetTokenExpires, new Date())
        )
      )
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json(
        { error: 'Ungültiger oder abgelaufener Reset-Link.' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update customer password and clear reset token
    await db.update(crmCustomers)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(crmCustomers.id, customer[0].id));

    return NextResponse.json({ 
      success: true, 
      message: 'Passwort erfolgreich zurückgesetzt!' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler.' },
      { status: 500 }
    );
  }
}
