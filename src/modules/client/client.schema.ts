import { schema } from '@api/plugins/db';

export type InsertClientType = typeof schema.client.$inferInsert;
export type UpdateClientType = Partial<InsertClientType>;
