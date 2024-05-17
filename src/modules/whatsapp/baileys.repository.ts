import { schema } from '@api/plugins/db';
import { SharedRepository } from '../shared/shared.repository';
import { and, eq } from 'drizzle-orm';
import {
  FindAuthKeyType,
  InsertAuthKeyType,
  InsertChatAndClient,
  InsertMessageType,
  SelectChatAndClientType,
} from './baileys.schema';

// Operaciones con DB para Baileys
export class BaileysRepository extends SharedRepository {
  async deleteAuthKey(data: FindAuthKeyType) {
    await this.db
      .delete(schema.waSessionAuthKey)
      .where(
        and(
          eq(schema.waSessionAuthKey.waSessionID, data.waSessionID),
          eq(schema.waSessionAuthKey.key, data.key),
        ),
      );
    return true;
  }

  async getAllSessions() {
    const waSessions = await this.db
      .select({
        waSessionID: schema.waSession.waSessionID,
        companyID: schema.waSession.companyID,
      })
      .from(schema.waSession);
    return waSessions;
  }

  async findAuthKey(data: FindAuthKeyType) {
    const sessionAuthKey = await this.db.query.waSessionAuthKey.findFirst({
      columns: { keyJSON: true, waSessionAuthKeyID: true },
      where: and(
        eq(schema.waSessionAuthKey.waSessionID, data.waSessionID),
        eq(schema.waSessionAuthKey.key, data.key),
      ),
    });
    if (!sessionAuthKey) {
      return null;
    }
    return sessionAuthKey;
  }

  async insertAuthKey(data: InsertAuthKeyType) {
    await this.db
      .insert(schema.waSessionAuthKey)
      .values({
        key: data.key,
        waSessionID: data.waSessionID,
        keyJSON: data.keyJSON,
      })
      .onConflictDoUpdate({
        set: {
          keyJSON: data.keyJSON,
        },
        target: [
          schema.waSessionAuthKey.waSessionID,
          schema.waSessionAuthKey.key,
        ],
      });
    return true;
  }

  async updateAuthKey(waSessionAuthKeyID: number, keyJSON: string) {
    console.log('UPDATE KEY: ', waSessionAuthKeyID, keyJSON);
    const update = await this.db
      .update(schema.waSessionAuthKey)
      .set({
        keyJSON: keyJSON,
      })
      .where(eq(schema.waSessionAuthKey.waSessionAuthKeyID, waSessionAuthKeyID))
      .returning();
    console.log('RESULT: ', update[0]?.key);
    console.log(update[0]?.keyJSON);
    return true;
  }

  async createChatAndClient(
    data: InsertChatAndClient,
  ): Promise<SelectChatAndClientType> {
    const { chat, client } = data;

    const result = await this.db.transaction(async (tx) => {
      const [newClient] = await tx
        .insert(schema.client)
        .values(client)
        .returning();

      const [newChat] = await this.db
        .insert(schema.chat)
        .values({ ...chat, clientID: newClient.clientID })
        .returning();
      return { newClient, newChat };
    });
    return { client: result.newClient, chat: result.newChat };
  }

  async findChatAndClient(
    jid: string,
    waSessionID: string,
  ): Promise<SelectChatAndClientType> {
    const [result] = await this.db
      .select()
      .from(schema.chat)
      .where(
        and(eq(schema.chat.jid, jid), eq(schema.chat.waSessionID, waSessionID)),
      )
      .leftJoin(
        schema.client,
        eq(schema.chat.clientID, schema.client.clientID),
      );
    return result;
  }

  async createManyMessages(messages: InsertMessageType[]) {
    await this.db.insert(schema.message).values(messages).returning();
  }
}
