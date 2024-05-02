import * as schema from '@api/db/schemas';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export async function startDatabase(DATABASE_URL: string) {
  const pool = await new Pool({
    connectionString: DATABASE_URL,
  })
    .connect()
    .then((client) => {
      console.log('INIT', 'Connected to database');

      return client;
    })
    .catch((error) => {
      console.log('INIT', `Failed to connect to database ${String(error)}}`);
      throw new Error(`Failed to connect to database ${String(error)}`);
    });

  const db = drizzle(pool, {
    schema,
  });

  return { db, schema };
}
