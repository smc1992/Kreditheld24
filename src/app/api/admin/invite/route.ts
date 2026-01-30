import { NextResponse } from 'next/server';
import { db, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendInviteEmail } from '@/lib/email-notifications';

export async function POST(request: Request) {
    try {
        const { email, firstName, lastName } = await request.json();

        if (!email || !firstName || !lastName) {
            return NextResponse.json({ error: 'Bitte Namen und E-Mail eingeben.' }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase();

        // Check if customer exists
        const existing = await db
            .select()
            .from(crmCustomers)
            .where(eq(crmCustomers.email, normalizedEmail));

        if (existing.length > 0) {
            return NextResponse.json({ error: 'Ein Benutzer mit dieser E-Mail existiert bereits.' }, { status: 409 });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create Customer
        await db.insert(crmCustomers).values({
            email: normalizedEmail,
            firstName,
            lastName,
            // Active & Verified immediately because Admin invited them
            isActiveUser: true,
            emailVerified: true,
            // Set reset token so they can set password
            resetToken,
            resetTokenExpires: resetExpires,
            // No password yet
            passwordHash: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Send Email
        const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/reset-password?token=${resetToken}`;

        await sendInviteEmail({
            to: normalizedEmail,
            firstName,
            inviteUrl
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Invite error:', error);
        return NextResponse.json({ error: 'Interner Serverfehler beim Einladen.' }, { status: 500 });
    }
}
