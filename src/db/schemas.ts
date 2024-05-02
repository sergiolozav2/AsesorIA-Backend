import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
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
    jid: varchar('jid', { length: 32 }).notNull(),
    waSessionID: varchar('waSessionID', { length: 32 })
      .notNull()
      .references(() => waSession.waSessionID),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    clientID: integer('clientID').references(() => client.clientID, {
      onDelete: 'set null',
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
  firstName: varchar('fullName', { length: 128 }).notNull(),
  lastName: varchar('fullName', { length: 128 }).notNull(),
  email: varchar('email', { length: 64 }).notNull(),
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
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  chatID: integer('chatID').references(() => chat.chatID, {
    onDelete: 'cascade',
  }),
});

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
