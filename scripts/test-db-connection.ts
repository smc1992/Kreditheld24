import postgres from 'postgres';

// Test both DATABASE_URL and DATABASE_URI
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URI = process.env.DATABASE_URI;

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  const connectionString = DATABASE_URL || DATABASE_URI;
  
  if (!connectionString) {
    console.error('❌ No DATABASE_URL or DATABASE_URI found in environment variables!');
    console.log('\nAvailable env vars:');
    console.log('DATABASE_URL:', DATABASE_URL ? '✓ Set' : '✗ Not set');
    console.log('DATABASE_URI:', DATABASE_URI ? '✓ Set' : '✗ Not set');
    process.exit(1);
  }

  console.log('📍 Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));
  console.log('');

  try {
    const sql = postgres(connectionString, {
      max: 1,
      connect_timeout: 10,
    });

    // Test basic connection
    console.log('⏳ Attempting to connect...');
    const result = await sql`SELECT NOW() as current_time, version()`;
    console.log('✅ Database connection successful!');
    console.log('🕐 Server time:', result[0].current_time);
    console.log('📦 PostgreSQL version:', result[0].version.split(',')[0]);
    console.log('');

    // Test admin_users table
    console.log('⏳ Checking admin_users table...');
    const adminCount = await sql`SELECT COUNT(*) as count FROM admin_users`;
    console.log('✅ admin_users table exists');
    console.log('👥 Admin users count:', adminCount[0].count);
    console.log('');

    // Test specific admin user
    console.log('⏳ Checking admin@kreditheld24.de...');
    const admin = await sql`
      SELECT id, email, name, role, active 
      FROM admin_users 
      WHERE email = 'admin@kreditheld24.de'
    `;
    
    if (admin.length > 0) {
      console.log('✅ Admin user found!');
      console.log('📧 Email:', admin[0].email);
      console.log('👤 Name:', admin[0].name);
      console.log('🔑 Role:', admin[0].role);
      console.log('✓ Active:', admin[0].active);
    } else {
      console.log('❌ Admin user not found!');
    }

    await sql.end();
    console.log('\n✅ All database checks passed!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\nPossible causes:');
    console.error('- Database server is not running');
    console.error('- Connection string is incorrect');
    console.error('- Firewall blocking connection');
    console.error('- Database credentials are wrong');
    process.exit(1);
  }
}

testConnection();
