import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, crmEmails } from '@/db';
import { eq } from 'drizzle-orm';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Soft delete: move to trash
        await db.update(crmEmails)
            .set({ status: 'trash' })
            .where(eq(crmEmails.id, params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting email:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Update logic provided via body (e.g. { starred: true } or { isRead: true })
        await db.update(crmEmails)
            .set(body)
            .where(eq(crmEmails.id, params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating email:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
