
import { db } from '../src/db';
import { crmActivities } from '../src/db/schema';

async function check() {
    console.log('Checking DB connection...');
    try {
        const activities = await db.select().from(crmActivities).limit(1);
        console.log('Successfully fetched activities:', activities);
        console.log('DB Connection OK.');
        process.exit(0);
    } catch (error) {
        console.error('DB Check Failed:', error);
        process.exit(1);
    }
}

check();
