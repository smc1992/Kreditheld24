
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { db, chatSessions, chatMessages, crmCustomers } from '@/db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge'; // Use Edge for streaming performance (check drizzle compat first, otherwise nodejs)
// Note: Drizzle PostgresJS usually works in Node. If Edge fails, remove this.
// Postgres.js is NOT Edge compatible usually. Node is safer for now.
// export const runtime = 'nodejs'; 

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const cookieStore = cookies();
        let sessionId = cookieStore.get('chat_session_id')?.value;

        // 1. Session Management
        let session;
        if (sessionId) {
            // Find existing
            // Note: In runtime 'nodejs', we can use our db instance.
            // We use fetch/API logic inside here? No, direct DB.
            // Ensure standard 'postgres' driver is used not edge-compatible if not supported.
            // But 'openai' SDK needs web streams. StreamingTextResponse works in Node effectively too.
        }

        // Since we are in a Route Handler, let's do the DB operations BEFORE streaming (user msg)
        // and AFTER streaming (ai msg) using callbacks?
        // AI SDK 'onFinish' callbacks are great.

        // Check/Create Session
        if (!sessionId) {
            // Create new session
            const newSession = await db.insert(chatSessions).values({
                aiEnabled: true,
                status: 'open'
            }).returning({ id: chatSessions.id });
            sessionId = newSession[0].id;
        }

        // Save User Message
        const lastUserMsg = messages[messages.length - 1];
        await db.insert(chatMessages).values({
            sessionId: sessionId,
            sender: 'user',
            content: lastUserMsg.content
        });

        // Update session last active
        await db.update(chatSessions).set({ lastMessageAt: new Date() }).where(eq(chatSessions.id, sessionId));

        // 2. RAG retrieval (Simple Placeholder for now)
        // In V2: Embed lastUserMsg.content -> search knowledgeBase -> append to system prompt
        const systemPrompt = `Du bist der hilfreiche KI-Assistent von Kreditheld24.
    Antworte freundlich, professionell und auf Deutsch.
    Deine Aufgabe ist es, Kunden bei Kreditfragen zu unterstützen.
    Wenn du etwas nicht weißt, sage, dass du einen menschlichen Kollegen hinzuziehst.
    `;

        // 3. OpenAI Call
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // or gpt-4
            stream: true,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
        });

        // 4. Stream Response & Save AI Message on finish
        const stream = OpenAIStream(response, {
            onCompletion: async (completion) => {
                // Save AI response to DB
                if (sessionId) {
                    await db.insert(chatMessages).values({
                        sessionId: sessionId,
                        sender: 'ai',
                        content: completion,
                        isRead: true
                    });
                    await db.update(chatSessions).set({ lastMessageAt: new Date() }).where(eq(chatSessions.id, sessionId));
                }
            },
        });

        // Set cookie if new
        const headers = new Headers();
        if (!cookieStore.get('chat_session_id')) {
            headers.append('Set-Cookie', `chat_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000`); // 30 days
        }

        return new StreamingTextResponse(stream, { headers });

    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process chat' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
