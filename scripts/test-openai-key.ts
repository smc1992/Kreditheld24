
import dotenv from 'dotenv';
import path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const key = process.env.OPENAI_API_KEY;

if (key) {
    if (key.startsWith('sk-')) {
        console.log(`✅ Success: OPENAI_API_KEY found! Starts with: ${key.substring(0, 7)}...`);
    } else {
        console.log(`⚠️ Warning: OPENAI_API_KEY found, but format looks unusual (doesn't start with sk-): ${key.substring(0, 3)}...`);
    }
} else {
    console.error('❌ Error: OPENAI_API_KEY is NOT set in process.env');
    console.log('Ensure .env file exists at:', envPath);
}
