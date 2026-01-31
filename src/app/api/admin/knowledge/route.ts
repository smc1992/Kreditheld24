import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getEmbedding } from '@/lib/rag';

export const runtime = 'nodejs';

// GET: List current knowledge base entries
export async function GET() {
    try {
        const items = await db.execute(sql`
      SELECT id, content, source, created_at 
      FROM knowledge_base 
      ORDER BY created_at DESC
    `);

        return NextResponse.json({ success: true, items });
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
