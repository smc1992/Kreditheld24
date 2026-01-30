import { NextResponse } from 'next/server';
import { db, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { password } = await request.json();
        const { id } = params;

        if (!password || password.length < 8) {
            return NextResponse.json({ error: 'Passwort muss mindestens 8 Zeichen lang sein.' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await db.update(crmCustomers)
            .set({
                passwordHash,
                updatedAt: new Date(),
                // Clear reset tokens as they are no longer needed if password is set manually
                resetToken: null,
                resetTokenExpires: null,
            })
            .where(eq(crmCustomers.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({ error: 'Interner Serverfehler.' }, { status: 500 });
    }
}
