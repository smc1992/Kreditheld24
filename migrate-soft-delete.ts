
import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function main() {
    try {
        console.log('Adding is_deleted_by_customer column...');
        await db.execute(sql`
      ALTER TABLE crm_documents 
      ADD COLUMN IF NOT EXISTS is_deleted_by_customer BOOLEAN DEFAULT FALSE;
    `);
        console.log('Migration successful!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

main();
