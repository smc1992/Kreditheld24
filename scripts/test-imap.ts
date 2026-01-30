
import imaps from 'imap-simple';
import dotenv from 'dotenv';
dotenv.config();

async function testImap() {
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

    console.log('Testing IMAP connection with config:', {
        user: config.imap.user,
        host: config.imap.host,
        port: config.imap.port
    });

    if (!config.imap.user || !config.imap.password) {
        console.error('❌ SMTP_USER or SMTP_PASS missing');
        return;
    }

    try {
        const connection = await imaps.connect(config);
        console.log('✅ Connected to IMAP');

        await connection.openBox('INBOX');
        console.log('✅ Opened INBOX');

        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
            struct: true
        };

        // Grab last 5 emails
        const messages = await connection.search(searchCriteria, fetchOptions);
        console.log(`✅ Found ${messages.length} messages`);

        const recent = messages.slice(-5);
        recent.forEach(msg => {
            const header = msg.parts[0].body;
            console.log(`- [${header.date[0]}] ${header.subject[0]} (From: ${header.from[0]})`);
        });

        connection.end();

    } catch (error) {
        console.error('❌ IMAP Error:', error);
    }
}

testImap();
