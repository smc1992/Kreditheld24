import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappTemplates } from '@/db';
import { eq, asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// GET - List all templates
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await db
      .select()
      .from(whatsappTemplates)
      .orderBy(asc(whatsappTemplates.sortOrder), asc(whatsappTemplates.name));

    return NextResponse.json({ success: true, templates });
  } catch (error) {
    console.error('[WhatsApp Templates] GET error:', error);
    return NextResponse.json({ success: true, templates: [] });
  }
}

// POST - Create a new template
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, category, content } = await request.json();

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    const [template] = await db.insert(whatsappTemplates).values({
      name,
      category: category || 'allgemein',
      content,
    }).returning();

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error('[WhatsApp Templates] POST error:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

// PUT - Update a template
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, category, content } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    await db.update(whatsappTemplates)
      .set({
        name, category, content,
        updatedAt: new Date(),
      })
      .where(eq(whatsappTemplates.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Templates] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

// DELETE - Delete a template
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    await db.delete(whatsappTemplates).where(eq(whatsappTemplates.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Templates] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
