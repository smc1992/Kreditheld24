import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmCases } from '@/db';
import { inArray } from 'drizzle-orm';

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    await db.delete(crmCases).where(inArray(crmCases.id, ids));

    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (error) {
    console.error('Database error during bulk delete:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete cases' },
      { status: 500 }
    );
  }
}
