import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  userID: serial('userID').primaryKey(),
  fullName: varchar('fullName', { length: 256 }).notNull(),
  password: varchar('password', { length: 128 }).notNull(),
  email: varchar('email', { length: 64 }).notNull().unique(),
  verified: boolean('verified').notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
});

export const company = pgTable('company', {
  companyID: serial('companyID').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  ownerID: integer('ownerID')
    .notNull()
    .references(() => user.userID, {
      onDelete: 'cascade',
    }),
});

export const waSession = pgTable('waSession', {
  waSessionID: varchar('waSessionID', { length: 100 }).primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  createdBy: integer('createdBy').references(() => user.userID, {
    onDelete: 'set null',
  }),
  companyID: integer('companyID')
    .notNull()
    .references(() => company.companyID, {
      onDelete: 'cascade',
    }),
});

export const chat = pgTable(
  'chat',
  {
    chatID: serial('chatID').primaryKey(),
    jid: varchar('jid', { length: 64 }).notNull(),
    waSessionID: varchar('waSessionID', { length: 100 }).notNull(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    clientID: integer('clientID')
      .notNull()
      .references(() => client.clientID),
    companyID: integer('companyID')
      .notNull()
      .references(() => company.companyID, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      WaSessionAndJidUnique: unique().on(table.waSessionID, table.jid),
    };
  },
);
export const client = pgTable('client', {
  clientID: serial('clientID').primaryKey(),
  firstName: varchar('firstName', { length: 128 }).notNull(),
  lastName: varchar('lastName', { length: 128 }),
  email: varchar('email', { length: 64 }),
  phone: varchar('phone', { length: 64 }),
  profilePicture: varchar('profilePicture', { length: 512 }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  companyID: integer('companyID')
    .notNull()
    .references(() => company.companyID, {
      onDelete: 'cascade',
    }),
});

export const message = pgTable('message', {
  messageID: serial('messageID').primaryKey(),
  waID: varchar('waID', { length: 64 }),
  content: json('content'),
  fromMe: boolean('fromMe').notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  chatID: integer('chatID')
    .notNull()
    .references(() => chat.chatID, {
      onDelete: 'cascade',
    }),
});

export const waSessionAuthKey = pgTable(
  'waSessionAuthKey',
  {
    waSessionAuthKeyID: serial('waSessionAuthKeyID').primaryKey(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    waSessionID: varchar('waSessionID', { length: 100 }).notNull(),
    key: varchar('key', { length: 255 }).notNull(),
    keyJSON: text('keyJSON').notNull(),
  },
  (t) => {
    return {
      keySessionUnique: unique().on(t.waSessionID, t.key),
    };
  },
);

export const chatRelations = relations(chat, ({ many, one }) => ({
  messages: many(message),
  client: one(client, {
    fields: [chat.clientID],
    references: [client.clientID],
  }),
  waSession: one(waSession, {
    fields: [chat.waSessionID],
    references: [waSession.waSessionID],
  }),
}));

export const messagesRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatID],
    references: [chat.chatID],
  }),
}));

export const sessionRelatiosns = relations(waSession, ({ many }) => ({
  chats: many(chat),
}));

export const userType = pgEnum('userType', ['dev', 'admin', 'user']);
export const permissionType = pgEnum('permissionType', [
  'module_chat',
  'module_company',
  'module_chatbot',
  'module_marketing',
  'module_client',
  'module_settings',
  'module_team',
]);
