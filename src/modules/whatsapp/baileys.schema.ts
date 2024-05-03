import { schema } from '@api/plugins/db';

export type InsertChatType = typeof schema.chat.$inferInsert;

export type InsertMessageType = typeof schema.message.$inferInsert;

export type SelectChatType = typeof schema.chat.$inferSelect;

export type SelectMessageType = typeof schema.message.$inferSelect;

export type InsertAuthKeyType = typeof schema.waSessionAuthKey.$inferInsert;
export type FindAuthKeyType = Omit<InsertAuthKeyType, 'keyJSON'>;
