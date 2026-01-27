import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, adminUsers } from '@/db';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const [updatedUser] = await db.update(adminUsers)
      .set({
        name,
        email,
        updatedAt: new Date()
      })
      .where(eq(adminUsers.id, session.user.id))
      .returning();

    return NextResponse.json({ 
      success: true, 
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}
