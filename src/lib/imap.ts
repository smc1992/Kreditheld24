
import imaps from 'imap-simple';
import { simpleParser, AddressObject } from 'mailparser';

/**
 * Helper to safely get the email address string from AddressObject or array
 */
function getAddressText(addr: AddressObject | AddressObject[] | undefined): string {
    if (!addr) return '';
    if (Array.isArray(addr)) {
        return addr.map(a => a.text).join(', ');
    }
    return addr.text;
}

/**
 * Connects to Strato IMAP and fetches emails for a specific customer email address.
 * 
 * @param customerEmail The email address to filter by (sender or recipient)
 * @param limit Max number of emails to fetch (default 50)
 */
export async function fetchEmailsForCustomer(customerEmail: string, limit = 50) {
    const config = {
        imap: {
            user: process.env.SMTP_USER || '',
            password: process.env.SMTP_PASS || '',
            host: 'imap.strato.de',
            port: 993,
            tls: true,
            authTimeout: 10000,
            tlsOptions: { rejectUnauthorized: false },
        },
    };

    if (!config.imap.user || !config.imap.password) {
        throw new Error('SMTP_USER or SMTP_PASS missing for IMAP connection');
    }

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = [
            ['OR', ['FROM', customerEmail], ['TO', customerEmail]]
        ];

        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: false,
            struct: true
        };

        // Fetch messages
        const messages = await connection.search(searchCriteria, fetchOptions);

        // Sort by date descending and limit
        messages.sort((a: any, b: any) => {
            const dateA = new Date(a.attributes.date);
            const dateB = new Date(b.attributes.date);
            return dateB.getTime() - dateA.getTime();
        });

        const recentMessages = messages.slice(0, limit);

        // Parse messages
        const parsedMessages = await Promise.all(recentMessages.map(async (item: any) => {
            const all = item.parts.find((part: any) => part.which === '');
            const id = item.attributes.uid;

            const body = all?.body || '';
            const parsed = await simpleParser(body);

            return {
                id: id.toString(),
                subject: parsed.subject,
                from: getAddressText(parsed.from),
                to: getAddressText(parsed.to),
                date: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
                text: parsed.text,
                html: parsed.html || parsed.textAsHtml,
                // Determine direction
                direction: parsed.from?.value?.some((addr: any) => addr.address === customerEmail) ? 'inbound' : 'outbound'
            };
        }));

        connection.end();
        return parsedMessages;

    } catch (error) {
        console.error('IMAP Fetch Error:', error);
        throw error;
    }
}

/**
 * Fetches the most recent emails from the inbox.
 * 
 * @param limit Max number of emails to fetch (default 50)
 */
export async function fetchRecentEmails(boxName = 'INBOX', limit = 50) {
    const config = {
        imap: {
            user: process.env.SMTP_USER || '',
            password: process.env.SMTP_PASS || '',
            host: 'imap.strato.de',
            port: 993,
            tls: true,
            authTimeout: 10000,
            tlsOptions: { rejectUnauthorized: false },
        },
    };

    if (!config.imap.user || !config.imap.password) {
        throw new Error('SMTP_USER or SMTP_PASS missing for IMAP connection');
    }

    try {
        const connection = await imaps.connect(config);
        await connection.openBox(boxName);

        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: false,
            struct: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        messages.sort((a: any, b: any) => {
            const dateA = new Date(a.attributes.date);
            const dateB = new Date(b.attributes.date);
            return dateB.getTime() - dateA.getTime();
        });

        const recentMessages = messages.slice(0, limit);

        const parsedMessages = await Promise.all(recentMessages.map(async (item: any) => {
            const all = item.parts.find((part: any) => part.which === '');
            const id = item.attributes.uid;

            const body = all?.body || '';
            const parsed = await simpleParser(body);

            return {
                id: id.toString(),
                subject: parsed.subject,
                from: getAddressText(parsed.from),
                sender: getAddressText(parsed.from), // Alias for UI compatibility
                recipient: getAddressText(parsed.to), // Alias for UI compatibility
                to: getAddressText(parsed.to),
                date: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
                text: parsed.text,
                preview: parsed.text ? parsed.text.substring(0, 100) + '...' : '',
                htmlContent: parsed.html || parsed.textAsHtml,
                textContent: parsed.text,
                status: 'read', // Default to read for now
                hasAttachment: false, // parsed.attachments && parsed.attachments.length > 0
                starred: false
            };
        }));

        connection.end();
        return parsedMessages;

    } catch (error) {
        console.error('IMAP Fetch Error:', error);
        return [];
    }
}
