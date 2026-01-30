import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  dbInstance: PostgresJsDatabase<typeof schema> | undefined;
};

function getDb() {
  if (!globalForDb.dbInstance) {
    // Support both DATABASE_URL and DATABASE_URI (Payload CMS uses DATABASE_URI)
    const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URI;

    if (!connectionString) {
      throw new Error('DATABASE_URL or DATABASE_URI environment variable is not set');
    }

    const client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    globalForDb.dbInstance = drizzle(client, { schema });
  }

  return globalForDb.dbInstance;
}

export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(target, prop) {
    const instance = getDb();
    return instance[prop as keyof typeof instance];
  }
});

export * from './schema';
