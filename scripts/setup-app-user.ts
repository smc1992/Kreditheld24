import 'dotenv/config';
import postgres from 'postgres';
import crypto from 'crypto';

const DATABASE_URL = process.env.POSTGRES_URL!;

async function setupAppUser() {
    console.log('🔌 Connecting to DB as superuser...');
    const sql = postgres(DATABASE_URL);

    const APP_USER = 'app_user';
    // Generate a strong random password
    const APP_PASSWORD = crypto.randomBytes(24).toString('hex');

    try {
        console.log(`🛠️ Creating/Updating user "${APP_USER}"...`);

        // 1. Create User (if not exists logic handled by check or just try/catch ignore)
        // Postgres doesn't have "CREATE USER IF NOT EXISTS" easily in one line without function wrapper, 
        // but we can check existence or just wrap in try/catch.

        const userExists = await sql`SELECT 1 FROM pg_roles WHERE rolname = ${APP_USER}`;

        if (userExists.length === 0) {
            await sql.unsafe(`CREATE USER "${APP_USER}" WITH PASSWORD '${APP_PASSWORD}'`);
            console.log('✅ User created.');
        } else {
            await sql.unsafe(`ALTER USER "${APP_USER}" WITH PASSWORD '${APP_PASSWORD}'`);
            console.log('✅ User password updated.');
        }

        // 2. Grant Connect
        // Note: Database name is usually in the connection string. We assume 'postgres' based on previous context.
        // We can get current db name:
        const dbNameResult = await sql`SELECT current_database()`;
        const dbName = dbNameResult[0].current_database;
        console.log(`ℹ️ Current DB: ${dbName}`);

        await sql`GRANT CONNECT ON DATABASE ${sql(dbName)} TO ${sql(APP_USER)}`;

        // 3. Grant Schema Usage
        await sql`GRANT USAGE ON SCHEMA public TO ${sql(APP_USER)}`;

        // 4. Grant Tables (CRUD)
        await sql`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${sql(APP_USER)}`;

        // 5. Grant Sequences (Required for IDs)
        await sql`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${sql(APP_USER)}`;

        // 6. Set Default Privileges (Future Tables)
        // Note: This applies to objects created by the current user (postgres) in the future.
        await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${sql(APP_USER)}`;
        await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO ${sql(APP_USER)}`;

        console.log('\nProcessing Complete! 🎉');
        console.log('------------------------------------------------');
        console.log('User:', APP_USER);
        console.log('Password:', APP_PASSWORD);
        console.log('permission:', 'SELECT, INSERT, UPDATE, DELETE');
        console.log('------------------------------------------------');
        console.log('⚠️  COPY THE PASSWORD NOW. It will not be shown again.');
        console.log('Use these credentials in your Coolify Application Environment Variables.');

        await sql.end();
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error setting up app user:', error); // Log full error object usually better but message is cleaner
        console.error(error.message);
        await sql.end();
        process.exit(1);
    }
}

setupAppUser();
