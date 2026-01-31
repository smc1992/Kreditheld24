import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getEmbedding } from '@/lib/rag';

export const runtime = 'nodejs';

// GET: List current knowledge base entries with pagination and search
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const offset = (page - 1) * limit;

        let whereClause = sql``;
        if (search) {
            const searchLower = `%${search.toLowerCase()}%`;
            whereClause = sql`WHERE LOWER(content) LIKE ${searchLower} OR LOWER(source) LIKE ${searchLower}`;
        }

        const totalResult = await db.execute(sql`
            SELECT COUNT(*) FROM knowledge_base ${whereClause}
        `);
        const total = Number((totalResult[0] as any).count);

        const items = await db.execute(sql`
            SELECT id, content, source, created_at 
            FROM knowledge_base 
            ${whereClause}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `);

        return NextResponse.json({
            success: true,
            items,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('KB List Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

// POST: Add new knowledge base entry
export async function POST(req: NextRequest) {
    try {
        const { content, source } = await req.json();

        if (!content) {
            return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
        }

        const embedding = await getEmbedding(content);
        const vectorStr = `[${embedding.join(',')}]`;

        await db.execute(sql`
      INSERT INTO knowledge_base (id, content, source, embedding, created_at)
      VALUES (gen_random_uuid(), ${content}, ${source || 'manual'}, ${vectorStr}::vector, NOW())
    `);

        return NextResponse.json({ success: true, message: 'Content added to Knowledge Base' });
    } catch (error) {
        console.error('KB Add Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
// PATCH: Update knowledge base entry
export async function PATCH(req: NextRequest) {
    try {
        const { id, content, source } = await req.json();

        if (!id || !content) {
            return NextResponse.json({ success: false, error: 'ID and Content are required' }, { status: 400 });
        }

        const embedding = await getEmbedding(content);
        const vectorStr = `[${embedding.join(',')}]`;

        await db.execute(sql`
      UPDATE knowledge_base 
      SET content = ${content}, 
          source = ${source || 'manual'}, 
          embedding = ${vectorStr}::vector,
          created_at = NOW()
      WHERE id = ${id}
    `);

        return NextResponse.json({ success: true, message: 'Content updated successfully' });
    } catch (error) {
        console.error('KB Update Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

// DELETE: Remove knowledge base entry
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await db.execute(sql`DELETE FROM knowledge_base WHERE id = ${id}`);

        return NextResponse.json({ success: true, message: 'Content deleted successfully' });
    } catch (error) {
        console.error('KB Delete Error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
