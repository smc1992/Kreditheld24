import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'postgres://postgres:H8oqIFRMBMU5904WuCHNxw6vNqHhfacpX8AbgLv9z2ULekRoz9MjT3WGelLMHURV@217.160.138.202:5432/postgres?sslmode=require';

async function createAdmin() {
  const email = process.argv[2] || 'admin@kreditheld24.de';
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Admin';

  console.log('🔐 Creating admin user...');

  const sql = postgres(DATABASE_URL);
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name, role, active)
      VALUES (${email}, ${passwordHash}, ${name}, 'admin', true)
      RETURNING id, email, name, role
    `;

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', result[0].email);
    console.log('👤 Name:', result[0].name);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  Please change the password after first login!');
    
    await sql.end();
    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('❌ User with this email already exists!');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
    await sql.end();
    process.exit(1);
  }
}

createAdmin();
