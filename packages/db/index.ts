import { env } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas/schema';

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, {
  schema
});

export { schema }
