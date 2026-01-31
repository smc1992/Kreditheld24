
import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function checkVector() {
    try {
        const result = await db.execute(sql`SELECT * FROM pg_available_extensions WHERE name = 'vector'`);
        console.log('Vector Extension Status:', result);
        process.exit(0);
    } catch (error) {
        console.error('Error checking vector:', error);
        process.exit(1);
    }
}

checkVector();
