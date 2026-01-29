import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const DATABASE_URL = 'postgres://postgres:H8oqIFRMBMU5904WuCHNxw6vNqHhfacpX8AbgLv9z2ULekRoz9MjT3WGelLMHURV@217.160.138.202:5432/postgres?sslmode=require';

async function createCustomerUser() {
  const email = process.argv[2] || 'test@kreditheld24.de';
  const password = process.argv[3] || 'test123';
  const firstName = process.argv[4] || 'Test';
  const lastName = process.argv[5] || 'User';

  console.log('🔐 Creating customer user...');

  const sql = postgres(DATABASE_URL);
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await sql`
      INSERT INTO crm_customers (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        is_active_user,
        created_at,
        updated_at
      )
      VALUES (
        ${email}, 
        ${passwordHash}, 
        ${firstName}, 
        ${lastName}, 
        true,
        NOW(),
        NOW()
      )
      RETURNING id, email, first_name, last_name, is_active_user
    `;

    console.log('✅ Customer user created successfully!');
    console.log('📧 Email:', result[0].email);
    console.log('👤 Name:', `${result[0].first_name} ${result[0].last_name}`);
    console.log('🔑 Password:', password);
    console.log('✓ Active:', result[0].is_active_user);
    console.log('\n🌐 Login at: https://kreditheld24.de/portal/login');
    console.log('\n⚠️  Please change the password after first login!');
    
    await sql.end();
    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('❌ User with this email already exists!');
      console.log('\n💡 Try resetting the password instead or use a different email.');
    } else {
      console.error('❌ Error creating customer:', error.message);
    }
    await sql.end();
    process.exit(1);
  }
}

createCustomerUser();
