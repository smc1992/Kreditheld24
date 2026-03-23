import { sql } from 'drizzle-orm';
import { db } from '../src/db';
import * as dotenv from 'dotenv';
dotenv.config();

async function runSafeMigration() {
  console.log('Starte sicheres Datenbank-Update...');

  const statements = [
    // 1. Spalten hinzufügen
    `ALTER TABLE "whatsapp_messages" ADD COLUMN IF NOT EXISTS "quoted_message_id" text;`,
    `ALTER TABLE "whatsapp_messages" ADD COLUMN IF NOT EXISTS "quoted_content" text;`,
    `ALTER TABLE "whatsapp_messages" ADD COLUMN IF NOT EXISTS "is_starred" boolean DEFAULT false NOT NULL;`,
    `ALTER TABLE "whatsapp_messages" ADD COLUMN IF NOT EXISTS "is_deleted" boolean DEFAULT false NOT NULL;`,
    `ALTER TABLE "whatsapp_messages" ADD COLUMN IF NOT EXISTS "is_forwarded" boolean DEFAULT false NOT NULL;`,
    `ALTER TABLE "whatsapp_messages" ADD COLUMN IF NOT EXISTS "status" text;`,

    // 2. Constraints hinzufügen (ohne Tabellenleerung)
    `ALTER TABLE "whatsapp_conversations" ADD CONSTRAINT "whatsapp_conversations_remote_jid_unique" UNIQUE("remote_jid");`,
    `ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_message_id_unique" UNIQUE("message_id");`,
    `ALTER TABLE "crm_cases" ADD CONSTRAINT "crm_cases_case_number_unique" UNIQUE("case_number");`,
    `ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_email_unique" UNIQUE("email");`,
    `ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_token_unique" UNIQUE("token");`,
    `ALTER TABLE "whatsapp_settings" ADD CONSTRAINT "whatsapp_settings_key_unique" UNIQUE("key");`
  ];

  for (const statement of statements) {
    try {
      console.log(`Führe aus: ${statement}`);
      await db.execute(sql.raw(statement));
      console.log('✅ Erfolgreich!');
    } catch (error: any) {
      if (error.code === '42P07') {
        console.log('ℹ️ Constraint existiert bereits, überspringe...');
      } else if (error.code === '23505') {
         console.warn('⚠️ Warnung: Es gibt doppelte Einträge in der Tabelle, UNIQUE kann nicht gesetzt werden für: ' + statement);
      } else if (error.code === '42501') {
         console.error('❌ FEHLER: Dir fehlen die Berechtigungen (Owner), um diese Tabelle zu ändern. Bitte prüfe den Datenbank-Benutzer.');
         break; // Abbrechen, da der Rest vermutlich auch scheitert
      } else {
        console.error('❌ Fehler:', error.message);
      }
    }
  }

  console.log('Fertig!');
  process.exit(0);
}

runSafeMigration();
