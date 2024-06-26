import { schema } from '@api/plugins/db';

export type InsertChatType = typeof schema.chat.$inferInsert;
export type InsertClientType = typeof schema.client.$inferInsert;

export type InsertMessageType = typeof schema.message.$inferInsert;

export type InsertChatAndClient = {
  chat: Omit<InsertChatType, 'clientID'>;
  client: InsertClientType;
};

export type SelectChatType = typeof schema.chat.$inferSelect;
export type SelectClientType = typeof schema.client.$inferSelect;

export type SelectChatAndClientType = {
  chat: SelectChatType;
  client: SelectClientType;
};

export type SelectMessageType = typeof schema.message.$inferSelect;

export type InsertAuthKeyType = typeof schema.waSessionAuthKey.$inferInsert;
export type FindAuthKeyType = Omit<InsertAuthKeyType, 'keyJSON'>;
