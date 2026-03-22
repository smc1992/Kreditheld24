
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { db, chatSessions, chatMessages, crmCustomers } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { findRelevantContent } from '@/lib/rag';

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const cookieStore = await cookies();
        let sessionId = cookieStore.get('chat_session_id')?.value;

        // Check/Create Session
        if (!sessionId) {
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

        // Check if AI is enabled for this session (Human Handover check)
        const [currentSession] = await db.select({ aiEnabled: chatSessions.aiEnabled })
            .from(chatSessions)
            .where(eq(chatSessions.id, sessionId))
            .limit(1);

        if (!currentSession?.aiEnabled) {
            // AI is disabled - Human Handover mode
            // Save a system message informing the user
            const handoverMessage = 'Ein Mitarbeiter wird sich in Kürze bei Ihnen melden. Bitte haben Sie einen Moment Geduld.';
            await db.insert(chatMessages).values({
                sessionId: sessionId,
                sender: 'ai',
                content: handoverMessage,
                isRead: true
            });

            // Set cookie if new
            const headers = new Headers();
            headers.set('Content-Type', 'application/json');
            if (!cookieStore.get('chat_session_id')) {
                headers.append('Set-Cookie', `chat_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000`);
            }

            return new Response(handoverMessage, { headers });
        }

        // 2. Load chatbot config from settings
        let chatbotConfig = {
            systemPrompt: `Du bist der hilfreiche KI-Assistent von Kreditheld24.
Antworte freundlich, professionell und auf Deutsch.
Deine Aufgabe ist es, Kunden bei Kreditfragen zu unterstützen.`,
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
        };

        try {
            const configResult = await db.execute(sql`
                SELECT value FROM admin_settings WHERE key = 'chatbot_config' LIMIT 1
            `);
            const savedConfig = (configResult as any).rows?.[0]?.value;
            if (savedConfig) {
                chatbotConfig = { ...chatbotConfig, ...savedConfig };
            }
        } catch (e) {
            // Use defaults if admin_settings table doesn't exist yet
        }

        // 3. RAG retrieval
        const contextDocs = await findRelevantContent(lastUserMsg.content);
        const contextText = contextDocs.map(doc => doc.content).join('\n\n');

        const systemPrompt = `${chatbotConfig.systemPrompt}

Hintergrundwissen (Nutze dies für deine Antwort):
${contextText}

Wenn keine relevanten Informationen oben stehen, nutze dein allgemeines Wissen, aber erfinde keine Fakten zu Kreditheld24.`;

        // 4. OpenAI Call
        const response = await openai.chat.completions.create({
            model: chatbotConfig.model as any,
            stream: true,
            temperature: chatbotConfig.temperature,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
        });

        // 4. Stream Response & Save AI Message on finish
        const stream = OpenAIStream(response, {
            onCompletion: async (completion: string) => {
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
            headers.append('Set-Cookie', `chat_session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000`);
        }

        return new StreamingTextResponse(stream, { headers });

    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to process chat',
            details: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
