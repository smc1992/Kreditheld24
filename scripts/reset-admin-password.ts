import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'postgres://postgres:H8oqIFRMBMU5904WuCHNxw6vNqHhfacpX8AbgLv9z2ULekRoz9MjT3WGelLMHURV@217.160.138.202:5432/postgres?sslmode=require';

async function resetAdminPassword() {
  const email = process.argv[2] || 'admin@kreditheld24.de';
  const newPassword = process.argv[3] || 'admin123';

  console.log('🔐 Resetting admin password...');
  console.log('📧 Email:', email);

  const sql = postgres(DATABASE_URL);
  const passwordHash = await bcrypt.hash(newPassword, 10);

  try {
    const result = await sql`
      UPDATE admin_users 
      SET password_hash = ${passwordHash}, active = true
      WHERE email = ${email}
      RETURNING id, email, name, role, active
    `;

    if (result.length === 0) {
      console.error('❌ No user found with email:', email);
      await sql.end();
      process.exit(1);
    }

    console.log('✅ Password reset successfully!');
    console.log('📧 Email:', result[0].email);
    console.log('👤 Name:', result[0].name);
    console.log('🔑 New Password:', newPassword);
    console.log('✓ Active:', result[0].active);
    console.log('\n⚠️  Please change the password after first login!');
    
    await sql.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error resetting password:', error.message);
    await sql.end();
    process.exit(1);
  }
}

resetAdminPassword();
