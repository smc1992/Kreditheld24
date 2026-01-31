
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
    const results: any[] = [];
    const formatError = (e: any) => {
        if (typeof e === 'object' && e !== null) {
            return {
                message: e.message,
                code: e.code,
                detail: e.detail || e.details,
                hint: e.hint,
                ...e // other props
            };
        }
        return String(e);
    };

    try {
        // 1. Check existing tables
        try {
            const tables = await db.execute(sql`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public';
            `);
            results.push({ step: 'check_tables', tables: tables.map(r => r.table_name) });
        } catch (e) {
            results.push({ step: 'check_tables', status: 'failed', error: formatError(e) });
        }

        // 2. Enable Extensions (RAG Support)
        try {
            await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "vector";`);
            results.push({ step: 'enable_vector_extension', status: 'success' });
        } catch (e) {
            results.push({ step: 'enable_vector_extension', status: 'failed', error: formatError(e) });
        }

        // 3. Create Tables

        // Chat Sessions
        try {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS chat_sessions (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    customer_id UUID REFERENCES crm_customers(id) ON DELETE CASCADE,
                    status VARCHAR(50) DEFAULT 'open' NOT NULL,
                    ai_enabled BOOLEAN DEFAULT true NOT NULL,
                    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
                );
            `);
            results.push({ step: 'create_chat_sessions', status: 'success' });
        } catch (e) {
            results.push({ step: 'create_chat_sessions', status: 'failed', error: formatError(e) });
        }

        // Chat Messages
        try {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS chat_messages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
                    sender VARCHAR(20) NOT NULL,
                    content TEXT NOT NULL,
                    metadata JSONB,
                    is_read BOOLEAN DEFAULT false,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
                );
            `);
            results.push({ step: 'create_chat_messages', status: 'success' });
        } catch (e) {
            results.push({ step: 'create_chat_messages', status: 'failed', error: formatError(e) });
        }

        // Knowledge Base
        try {
            await db.execute(sql`
                CREATE TABLE IF NOT EXISTS knowledge_base (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    content TEXT NOT NULL,
                    source VARCHAR(255),
                    embedding vector(1536),
                    metadata JSONB,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
                );
            `);
            results.push({ step: 'create_knowledge_base', status: 'success' });
        } catch (e) {
            results.push({ step: 'create_knowledge_base', status: 'failed', error: formatError(e) });
        }

        return NextResponse.json({ success: true, log: results });
    } catch (error) {
        console.error('Migration Error:', error);
        return NextResponse.json({
            success: false,
            error: formatError(error),
            log: results
        }, { status: 500 });
    }
}
