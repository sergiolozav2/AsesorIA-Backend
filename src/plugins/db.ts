import { startDatabase } from '@api/db/startDatabase';
import { drizzle } from 'drizzle-orm/node-postgres';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import * as schemaDB from '@api/db/schemas';

export let db: ReturnType<typeof drizzle<typeof schema>>;
export const schema = schemaDB;
export type DbType = ReturnType<typeof drizzle<typeof schema>>;

async function plugin(fastify: FastifyInstance) {
  const { db: dbReady } = await startDatabase(fastify.config.DATABASE_URL);
  db = dbReady;
}

export default fastifyPlugin(plugin, {
  name: 'db',
  dependencies: ['config'],
});
