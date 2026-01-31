import 'dotenv/config';
import postgres from 'postgres';

const DATABASE_URL = process.env.POSTGRES_URL!;

async function initDb() {
    console.log('🔌 Connecting to DB...');
    const sql = postgres(DATABASE_URL);

    try {
        console.log('🛠️ Enabling "uuid-ossp" extension...');
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        console.log('✅ Extension enabled successfully!');

        await sql.end();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error initializing DB:', error.message);
        await sql.end();
        process.exit(1);
    }
}

initDb();
