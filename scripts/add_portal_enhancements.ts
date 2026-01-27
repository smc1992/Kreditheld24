import 'dotenv/config';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not set');
}

const sql = postgres(connectionString);

async function migrate() {
  console.log('Adding portal enhancement columns and tables...');

  try {
    // Add email verification columns to crm_customers
    await sql`
      ALTER TABLE crm_customers 
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255),
      ADD COLUMN IF NOT EXISTS email_verification_expires TIMESTAMP WITH TIME ZONE;
    `;
    console.log('✓ Added email verification columns to crm_customers');

    // Create crm_case_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS crm_case_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        case_id UUID NOT NULL REFERENCES crm_cases(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL,
        sender_type VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log('✓ Created crm_case_messages table');

    // Create indexes for crm_case_messages
    await sql`
      CREATE INDEX IF NOT EXISTS idx_crm_case_messages_case ON crm_case_messages(case_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_crm_case_messages_sender ON crm_case_messages(sender_id);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_crm_case_messages_created_at ON crm_case_messages(created_at);
    `;
    console.log('✓ Created indexes for crm_case_messages');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate();
