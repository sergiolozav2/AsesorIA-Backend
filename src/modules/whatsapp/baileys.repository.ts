import { schema } from '@api/plugins/db';
import { SharedRepository } from '../shared/shared.repository';
import { and, eq } from 'drizzle-orm';
import {
  FindAuthKeyType,
  InsertAuthKeyType,
  InsertChatType,
  InsertMessageType,
  SelectChatType,
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
      columns: { keyJSON: true },
      where: and(
        eq(schema.waSessionAuthKey.waSessionID, data.waSessionID),
        eq(schema.waSessionAuthKey.key, data.key),
      ),
    });
    if (!sessionAuthKey) {
      return null;
    }
    return sessionAuthKey.keyJSON;
  }

  // Se que deberían ser operaciones sencillas
  // Pero esta función no se relaciona a la lógica del negocio
  // Solo la uso para actualizar las llaves de Whatsapp
  async insertOrUpdateAuthKeys(data: InsertAuthKeyType) {
    const { key, waSessionID, keyJSON } = data;
    const waSessionAuthKey = await this.db.query.waSessionAuthKey.findFirst({
      columns: { waSessionAuthKeyID: true },
      where: and(
        eq(schema.waSessionAuthKey.waSessionID, waSessionID),
        eq(schema.waSessionAuthKey.key, key),
      ),
    });
    // Si existe la llave actualizar el valor
    if (waSessionAuthKey) {
      await this.db
        .update(schema.waSessionAuthKey)
        .set({
          keyJSON: keyJSON,
        })
        .where(
          eq(
            schema.waSessionAuthKey.waSessionAuthKeyID,
            waSessionAuthKey.waSessionAuthKeyID,
          ),
        );
      return;
    }

    // Sino, crearla
    await this.db.insert(schema.waSessionAuthKey).values({
      key,
      waSessionID,
      keyJSON,
    });
  }

  async createChat(data: InsertChatType) {
    const [channel] = await this.db
      .insert(schema.chat)
      .values(data)
      .returning();
    return channel;
  }

  async findChatByID(
    jid: string,
    waSessionID: string,
  ): Promise<SelectChatType> {
    const [chat] = await this.db
      .select()
      .from(schema.chat)
      .where(
        and(eq(schema.chat.jid, jid), eq(schema.chat.waSessionID, waSessionID)),
      );
    return chat;
  }

  async createManyMessages(messages: InsertMessageType[]) {
    await this.db.insert(schema.message).values(messages).returning();
  }
}
