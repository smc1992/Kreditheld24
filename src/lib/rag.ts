import OpenAI from 'openai';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text: string): Promise<number[]> {
    if (!text) return [];

    // Cleanup text
    const cleanText = text.replace(/\n/g, ' ');

    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small', // High performance, low cost
        input: cleanText,
        encoding_format: 'float',
    });

    return response.data[0].embedding;
}

export async function findRelevantContent(query: string, limit = 4, threshold = 0.5) {
    const embedding = await getEmbedding(query);
    if (embedding.length === 0) return [];

    // Convert to Postgres vector string format
    const vectorStr = `[${embedding.join(',')}]`;

    // Execute raw SQL for vector search
    // Note: We use <=> (cosine distance). 1 - distance = similarity.
    // We cast the output to known types.
    // The table 'knowledge_base' was created via raw SQL.
    try {
        const results = await db.execute(sql`
      SELECT 
        id,
        content,
        source,
        1 - (embedding <=> ${vectorStr}::vector) as similarity
      FROM knowledge_base
      WHERE 1 - (embedding <=> ${vectorStr}::vector) > ${threshold}
      ORDER BY similarity DESC
      LIMIT ${limit};
    `);

        return results as unknown as Array<{
            content: string;
            source: string;
            similarity: number;
        }>;
    } catch (error) {
        console.error('Vector search error:', error);
        // Fallback if vector column missing or error
        return [];
    }
}
