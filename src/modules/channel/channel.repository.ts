import { schema } from '@api/plugins/db';
import { SharedRepository } from '../shared/shared.repository';
import { and, eq } from 'drizzle-orm';
import { InsertChatType } from './channel.schema';

export class ChannelRepository extends SharedRepository {
  async findByID(jid: string, waSessionID: string) {
    const [chat] = await this.db
      .select()
      .from(schema.chat)
      .where(
        and(eq(schema.chat.jid, jid), eq(schema.chat.waSessionID, waSessionID)),
      );
    return chat;
  }

  async getAllSessions(companyID: number) {
    const waSessions = await this.db
      .select()
      .from(schema.waSession)
      .where(eq(schema.waSession.companyID, companyID));
    return waSessions;
  }

  async createChat(data: InsertChatType) {
    const [channel] = await this.db
      .insert(schema.chat)
      .values(data)
      .returning();
    return channel;
  }
}
