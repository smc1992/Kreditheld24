import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!dbInstance) {
    // Support both DATABASE_URL and DATABASE_URI (Payload CMS uses DATABASE_URI)
    const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URI;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL or DATABASE_URI environment variable is not set');
    }

    client = postgres(connectionString, { 
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    dbInstance = drizzle(client, { schema });
  }

  return dbInstance;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    const instance = getDb();
    return instance[prop as keyof typeof instance];
  }
});

export * from './schema';
