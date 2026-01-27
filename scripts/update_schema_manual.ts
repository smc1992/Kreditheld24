import 'dotenv/config';
import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Updating schema...');
  
  try {
    await db.execute(sql`
      ALTER TABLE "crm_customers" ADD COLUMN IF NOT EXISTS "password_hash" varchar(255);
      ALTER TABLE "crm_customers" ADD COLUMN IF NOT EXISTS "is_active_user" boolean DEFAULT false;
      ALTER TABLE "crm_customers" ADD COLUMN IF NOT EXISTS "last_login" timestamp with time zone;
      ALTER TABLE "crm_customers" ADD COLUMN IF NOT EXISTS "reset_token" varchar(255);
      ALTER TABLE "crm_customers" ADD COLUMN IF NOT EXISTS "reset_token_expires" timestamp with time zone;
    `);
    console.log('Schema updated successfully.');
  } catch (err) {
    console.error('Error updating schema:', err);
  }
  
  process.exit(0);
}

main();
