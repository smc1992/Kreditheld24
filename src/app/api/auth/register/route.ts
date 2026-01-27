import { NextResponse } from 'next/server';
import { db, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmailVerification } from '@/lib/email-notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Bitte alle Felder ausfüllen.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    
    // Check if customer exists
    const existingCustomer = await db
      .select()
      .from(crmCustomers)
      .where(eq(crmCustomers.email, normalizedEmail))
      .limit(1);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (existingCustomer.length > 0) {
      const customer = existingCustomer[0];
      
      if (customer.isActiveUser) {
        return NextResponse.json(
          { error: 'Ein Benutzerkonto mit dieser E-Mail existiert bereits.' },
          { status: 409 }
        );
      }

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Upgrade existing customer to active user
      await db.update(crmCustomers)
        .set({
          passwordHash,
          isActiveUser: true,
          emailVerified: false,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: verificationExpires,
          firstName: firstName || customer.firstName,
          lastName: lastName || customer.lastName,
          updatedAt: new Date(),
        })
        .where(eq(crmCustomers.id, customer.id));

      // Send verification email
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/verify-email?token=${verificationToken}`;
      await sendEmailVerification({
        to: normalizedEmail,
        firstName: firstName || customer.firstName,
        verificationUrl,
      });

      return NextResponse.json({ success: true, message: 'Konto erfolgreich aktiviert. Bitte bestätigen Sie Ihre E-Mail-Adresse.' });
    } else {
      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create new customer
      await db.insert(crmCustomers).values({
        email: normalizedEmail,
        passwordHash,
        firstName,
        lastName,
        isActiveUser: true,
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Send verification email
      const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/verify-email?token=${verificationToken}`;
      await sendEmailVerification({
        to: normalizedEmail,
        firstName,
        verificationUrl,
      });

      return NextResponse.json({ success: true, message: 'Konto erfolgreich erstellt. Bitte bestätigen Sie Ihre E-Mail-Adresse.' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler bei der Registrierung.' },
      { status: 500 }
    );
  }
}
