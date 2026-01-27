import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env file from project root
dotenv.config({ path: resolve(__dirname, '../.env') });

import { db, adminUsers } from '../src/db';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const email = process.argv[2] || 'admin@kreditheld24.de';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin';

  console.log('🔐 Creating admin user...');

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const admin = await db
      .insert(adminUsers)
      .values({
        email,
        passwordHash,
        name,
        role: 'admin',
        active: true,
      })
      .returning();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin[0].email);
    console.log('👤 Name:', admin[0].name);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
